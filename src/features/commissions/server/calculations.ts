import { CommissionRole, OpportunityType, OpportunityStatus } from "@/generated/prisma";
import prisma from "@/lib/db";

interface CalculateCommissionsInput {
  opportunityId: string;
  opportunityType: OpportunityType;
}

interface UserRoleInfo {
  userId: string;
  roleType: CommissionRole;
  commissionPercentage: number;
}

/**
 * Calculate and store commission values for an opportunity when it's concluded.
 * This function:
 * 1. Identifies all users entitled to commissions based on their roles
 * 2. Retrieves their commission percentages from the Commission table
 * 3. Calculates the commission amounts based on the commissionable_amount
 * 4. Creates or updates CommissionValue records
 * 
 * Special handling:
 * - ACCOUNT_MANAGER: If 2 managers exist, each gets half the percentage
 * - Handles zero percentages without throwing errors
 */
export async function calculateOpportunityCommissions(input: CalculateCommissionsInput) {
  const { opportunityId, opportunityType } = input;

  // Step 1: Get the opportunity and its analytics
  let opportunity: any;
  let analytics: any;

  if (opportunityType === OpportunityType.MNA) {
    opportunity = await prisma.mergerAndAcquisition.findUnique({
      where: { id: opportunityId },
      select: {
        id: true,
        name: true,
        status: true,
        clientAcquisitionerId: true,
        analytics: {
          select: {
            id: true,
            commissionable_amount: true,
            invested_person_id: true,
            followup_person_id: true,
          },
        },
      },
    });
    analytics = opportunity?.analytics;
  } else {
    opportunity = await prisma.realEstate.findUnique({
      where: { id: opportunityId },
      select: {
        id: true,
        name: true,
        status: true,
        clientAcquisitionerId: true,
        analytics: {
          select: {
            id: true,
            commissionable_amount: true,
            invested_person_id: true,
            followup_person_id: true,
          },
        },
      },
    });
    analytics = opportunity?.analytics;
  }

  if (!opportunity) {
    throw new Error(`Opportunity not found: ${opportunityId}`);
  }

  // Only calculate commissions for concluded opportunities with a commissionable amount
  if (opportunity.status !== OpportunityStatus.CONCLUDED) {
    console.log(`Opportunity ${opportunityId} is not concluded, skipping commission calculation`);
    return;
  }

  if (!analytics || analytics.commissionable_amount == null) {
    console.log(`Opportunity ${opportunityId} has no commissionable amount set, skipping commission calculation`);
    return;
  }

  const commissionableAmount = analytics.commissionable_amount;

  // Step 2: Identify all users with roles in this opportunity
  const usersWithRoles: UserRoleInfo[] = [];

  // 2a. Client Acquisitioner
  if (opportunity.clientAcquisitionerId) {
    const commission = await prisma.commission.findUnique({
      where: {
        userId_roleType: {
          userId: opportunity.clientAcquisitionerId,
          roleType: CommissionRole.CLIENT_ACQUISITION,
        },
      },
      select: {
        userId: true,
        roleType: true,
        commissionPercentage: true,
      },
    });

    if (commission) {
      usersWithRoles.push(commission);
    }
  }

  // 2b. Client Originator (who brought the client)
  if (opportunity.clientOriginatorId) {
    const commission = await prisma.commission.findUnique({
      where: {
        userId_roleType: {
          userId: opportunity.clientOriginatorId,
          roleType: CommissionRole.CLIENT_ORIGINATOR,
        },
      },
      select: {
        userId: true,
        roleType: true,
        commissionPercentage: true,
      },
    });

    if (commission) {
      usersWithRoles.push(commission);
    }
  }

  // 2c. Account Managers
  const accountManagers = await prisma.opportunityAccountManager.findMany({
    where: {
      opportunityId,
      opportunityType,
    },
    select: {
      userId: true,
    },
  });

  const accountManagerCount = accountManagers.length;

  for (const manager of accountManagers) {
    const commission = await prisma.commission.findUnique({
      where: {
        userId_roleType: {
          userId: manager.userId,
          roleType: CommissionRole.ACCOUNT_MANAGER,
        },
      },
      select: {
        userId: true,
        roleType: true,
        commissionPercentage: true,
      },
    });

    if (commission) {
      // If there are 2 account managers, split the percentage in half
      const adjustedPercentage =
        accountManagerCount === 2
          ? commission.commissionPercentage / 2
          : commission.commissionPercentage;

      usersWithRoles.push({
        userId: commission.userId,
        roleType: commission.roleType,
        commissionPercentage: adjustedPercentage,
      });
    }
  }

  // 2d. Deal Support (invested_person and followup_person)
  const dealSupportIds = new Set<string>();
  
  if (analytics.invested_person_id) {
    dealSupportIds.add(analytics.invested_person_id);
  }
  
  if (analytics.followup_person_id) {
    dealSupportIds.add(analytics.followup_person_id);
  }

  for (const userId of dealSupportIds) {
    const commission = await prisma.commission.findUnique({
      where: {
        userId_roleType: {
          userId,
          roleType: CommissionRole.DEAL_SUPPORT,
        },
      },
      select: {
        userId: true,
        roleType: true,
        commissionPercentage: true,
      },
    });

    if (commission) {
      usersWithRoles.push(commission);
    }
  }

  // Step 3: Calculate and store commission values
  const results = await Promise.all(
    usersWithRoles.map(async (userRole) => {
      // Calculate commission amount
      const commissionValue = (commissionableAmount * userRole.commissionPercentage) / 100;

      // Get the commission ID
      const commission = await prisma.commission.findUnique({
        where: {
          userId_roleType: {
            userId: userRole.userId,
            roleType: userRole.roleType,
          },
        },
        select: {
          id: true,
        },
      });

      if (!commission) {
        console.warn(
          `Commission not found for user ${userRole.userId} with role ${userRole.roleType}`
        );
        return null;
      }

      // Upsert the commission value
      const commissionValueRecord = await prisma.commissionValue.upsert({
        where: {
          opportunityId_opportunityType_commissionId: {
            opportunityId,
            opportunityType,
            commissionId: commission.id,
          },
        },
        create: {
          opportunityId,
          opportunityType,
          commissionId: commission.id,
          totalCommissionValue: commissionValue,
        },
        update: {
          totalCommissionValue: commissionValue,
        },
        include: {
          commission: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return commissionValueRecord;
    })
  );

  // Filter out null results
  const validResults = results.filter((r) => r !== null);

  console.log(
    `Calculated commissions for opportunity ${opportunityId}: ${validResults.length} commission values created/updated`
  );

  return validResults;
}

/**
 * Trigger commission calculations when an opportunity is concluded.
 * Can be called from updateStatus or updateFinalValues mutations.
 */
export async function triggerCommissionCalculations(
  opportunityId: string,
  opportunityType: OpportunityType
) {
  try {
    await calculateOpportunityCommissions({
      opportunityId,
      opportunityType,
    });
  } catch (error) {
    console.error(
      `Error calculating commissions for opportunity ${opportunityId}:`,
      error
    );
    // Don't throw - we don't want to fail the main operation if commission calculation fails
    // This allows admins to fix commission data and recalculate later if needed
  }
}

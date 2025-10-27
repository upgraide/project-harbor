import prisma from "@/lib/db";

/**
 * Increment view count for a Merger & Acquisition opportunity
 */
export const incrementMnaViews = async (opportunityId: string) => {
  const analytics = await prisma.opportunityAnalytics.findFirst({
    where: { mergerAndAcquisitionId: opportunityId },
  });

  if (!analytics) {
    // Create analytics if it doesn't exist (for legacy opportunities)
    return await prisma.opportunityAnalytics.create({
      data: {
        mergerAndAcquisitionId: opportunityId,
        views: 1,
      },
    });
  }

  return await prisma.opportunityAnalytics.update({
    where: { id: analytics.id },
    data: { views: { increment: 1 } },
  });
};

/**
 * Increment view count for a Real Estate opportunity
 */
export const incrementRealEstateViews = async (opportunityId: string) => {
  const analytics = await prisma.opportunityAnalytics.findFirst({
    where: { realEstateId: opportunityId },
  });

  if (!analytics) {
    // Create analytics if it doesn't exist (for legacy opportunities)
    return await prisma.opportunityAnalytics.create({
      data: {
        realEstateId: opportunityId,
        views: 1,
      },
    });
  }

  return await prisma.opportunityAnalytics.update({
    where: { id: analytics.id },
    data: { views: { increment: 1 } },
  });
};

/**
 * Get analytics for a Merger & Acquisition opportunity
 */
export const getMnaAnalytics = async (opportunityId: string) =>
  await prisma.opportunityAnalytics.findFirst({
    where: { mergerAndAcquisitionId: opportunityId },
  });

/**
 * Get analytics for a Real Estate opportunity
 */
export const getRealEstateAnalytics = async (opportunityId: string) =>
  await prisma.opportunityAnalytics.findFirst({
    where: { realEstateId: opportunityId },
  });

/**
 * Create analytics entry for a Merger & Acquisition opportunity
 * (Usually handled automatically via Prisma create, but useful for migrations)
 */
export const createMnaAnalytics = async (opportunityId: string) =>
  await prisma.opportunityAnalytics.create({
    data: {
      mergerAndAcquisitionId: opportunityId,
    },
  });

/**
 * Create analytics entry for a Real Estate opportunity
 * (Usually handled automatically via Prisma create, but useful for migrations)
 */
export const createRealEstateAnalytics = async (opportunityId: string) =>
  await prisma.opportunityAnalytics.create({
    data: {
      realEstateId: opportunityId,
    },
  });

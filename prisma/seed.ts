import { faker } from "@faker-js/faker";
import {
  EbitdaRange,
  Industry,
  IndustrySubsector,
  InvestorClientType,
  InvestorSegment,
  InvestorStrategy,
  InvestorType,
  OpportunityStatus,
  PrismaClient,
  RealEstateAssetType,
  RealEstateInvestmentType,
  Role,
  SalesRange,
  Type,
  TypeDetails,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Create Admin User
  const adminEmail = "admin@harbor.com";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: faker.string.uuid(),
      email: adminEmail,
      name: "Admin User",
      role: Role.ADMIN,
      emailVerified: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create Team Users
  const teamUsers = [];
  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email({
      firstName: "Team",
      lastName: `Member${i}`,
    });
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        role: Role.TEAM,
        emailVerified: true,
      },
    });
    teamUsers.push(user);
  }
  console.log(`Created ${teamUsers.length} team users`);

  // Create Regular Users / Investors
  const investors = [];
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: faker.string.uuid(),
        email,
        name: faker.person.fullName(),
        role: Role.USER,
        emailVerified: true,
        investorType: faker.helpers.arrayElement(Object.values(InvestorType)),
        preferredLocation: faker.location.city(),
        companyName: faker.company.name(),
        type: faker.helpers.arrayElement(Object.values(InvestorClientType)),
        strategy1: faker.helpers.arrayElement(Object.values(InvestorStrategy)),
        segment1: faker.helpers.arrayElement(Object.values(InvestorSegment)),
        minTicketSize: faker.number.float({ min: 100_000, max: 1_000_000 }),
        maxTicketSize: faker.number.float({ min: 1_000_000, max: 10_000_000 }),
      },
    });
    investors.push(user);
  }
  console.log(`Created ${investors.length} investors`);

  // Create M&A Opportunities
  for (let i = 0; i < 10; i++) {
    await prisma.mergerAndAcquisition.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        englishDescription: faker.lorem.paragraph(),
        images: [faker.image.url(), faker.image.url()],
        type: faker.helpers.arrayElement(Object.values(Type)),
        typeDetails: faker.helpers.arrayElement(Object.values(TypeDetails)),
        industry: faker.helpers.arrayElement(Object.values(Industry)),
        industrySubsector: faker.helpers.arrayElement(
          Object.values(IndustrySubsector)
        ),
        sales: faker.helpers.arrayElement(Object.values(SalesRange)),
        ebitda: faker.helpers.arrayElement(Object.values(EbitdaRange)),
        ebitdaNormalized: faker.number.float({ min: 100_000, max: 5_000_000 }),
        netDebt: faker.number.float({ min: 0, max: 1_000_000 }),
        userId: admin.id, // Created by admin
        status: OpportunityStatus.ACTIVE,
        clientAcquisitionerId: faker.helpers.arrayElement(teamUsers).id,
        analytics: {
          create: {
            views: faker.number.int({ min: 0, max: 1000 }),
          },
        },
      },
    });
  }
  console.log("Created M&A opportunities");

  // Create Real Estate Opportunities
  for (let i = 0; i < 10; i++) {
    await prisma.realEstate.create({
      data: {
        name: faker.location.streetAddress(),
        description: faker.lorem.paragraph(),
        englishDescription: faker.lorem.paragraph(),
        images: [faker.image.url(), faker.image.url()],
        asset: faker.helpers.arrayElement(Object.values(RealEstateAssetType)),
        investment: faker.helpers.arrayElement(
          Object.values(RealEstateInvestmentType)
        ),
        location: faker.location.city(),
        value: faker.number.float({ min: 500_000, max: 10_000_000 }),
        yield: faker.number.float({ min: 0.03, max: 0.15 }),
        createdBy: admin.id,
        status: OpportunityStatus.ACTIVE,
        clientAcquisitionerId: faker.helpers.arrayElement(teamUsers).id,
        analytics: {
          create: {
            views: faker.number.int({ min: 0, max: 1000 }),
          },
        },
      },
    });
  }
  console.log("Created Real Estate opportunities");

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

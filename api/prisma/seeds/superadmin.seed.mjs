/**
 * Super Admin Seed Data
 * Creates default super admin users and their company
 */

export const superAdminData = {
  company: {
    id: "1f13a4d0-b848-4a77-86b2-195df1283f9d",
    name: "CodeVel",
    GSTIN: "36AAPFC5403Q1ZY",
    PAN: "",
    address: "39 2 40 NEAR GOVT SCHOOL SINGARAM WARANGAL URBAN INAVOLU SINGARAM WARDHANNAPET WARANGAL, Telangana, India - 506005",
    websiteUrl: "",
    employeeRange: "TWENTY_PLUS"
  },
  admins: [
    {
      id: "8f048049-7cec-49f1-a004-ca5910a5f956",
      name: "venkateshwarlu velisoju",
      email: "vvelisoju121@gmail.com",
      userType: "USER"
    },
    {
      id: "12ad3146-1d2b-483b-a8f2-327c7c86ae8e",
      name: "karthikeya maturi",
      email: "bunnymkk9+admin@gmail.com",
      userType: "USER"
    }
  ]
};

export async function seedSuperAdmins(prisma) {
  console.log("🔧 Seeding super admins...");
  
  try {
    // Create company
    const company = await prisma.company.upsert({
      where: { id: superAdminData.company.id },
      update: {},
      create: superAdminData.company
    });

    // Create admin users and super admin records
    for (const adminData of superAdminData.admins) {
      const user = await prisma.user.upsert({
        where: { id: adminData.id },
        update: {},
        create: {
          ...adminData,
          companyId: company.id
        }
      });

      await prisma.superAdmin.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      });

      console.log(`  ✓ Created super admin: ${user.email}`);
    }

    console.log("✅ Super admins seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding super admins:", error);
    throw error;
  }
}

/**
 * App Settings Seed Data
 * Creates default application and invoice settings
 */

export const appSettingsData = {
  id: "1",
  ccEmails: "vvelisoju121@gmail.com,bunnymkk9@gmail.com"
};

export const invoiceSettingsData = {
  id: "1",
  invoiceNumber: 1001,
  taxInvoiceNumber: 1001
};

export async function seedAppSettings(prisma) {
  console.log("⚙️  Seeding app settings...");
  
  try {
    await prisma.appSetting.upsert({
      where: { id: appSettingsData.id },
      update: {},
      create: appSettingsData
    });
    console.log("  ✓ Created app settings");

    console.log("✅ App settings seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding app settings:", error);
    throw error;
  }
}

export async function seedInvoiceSettings(prisma) {
  console.log("📄 Seeding invoice settings...");
  
  try {
    await prisma.invoiceSetting.upsert({
      where: { id: invoiceSettingsData.id },
      update: {},
      create: invoiceSettingsData
    });
    console.log("  ✓ Created invoice settings");

    console.log("✅ Invoice settings seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding invoice settings:", error);
    throw error;
  }
}

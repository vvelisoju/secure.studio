/**
 * Main Seed File
 * Orchestrates all seed operations in the correct order
 */

import { PrismaClient } from "@prisma/client";
import { seedSuperAdmins } from "./seeds/superadmin.seed.mjs";
import { seedEmailTemplates } from "./seeds/email-templates.seed.mjs";
import { seedNotificationTemplates, seedNotificationSchedules } from "./seeds/notification-templates.seed.mjs";
import { seedServices } from "./seeds/services.seed.mjs";
import { seedHolidays } from "./seeds/holidays.seed.mjs";
import { seedAppSettings, seedInvoiceSettings } from "./seeds/app-settings.seed.mjs";

const prisma = new PrismaClient();

/**
 * Main seeding function
 * Seeds are executed in dependency order:
 * 1. Super Admins (creates company and admin users)
 * 2. Email Templates (required by notification templates)
 * 3. Notification Templates (required by notification schedules)
 * 4. Notification Schedules
 * 5. Services & Plans (business logic data)
 * 6. Holidays (calendar data)
 * 7. App Settings (application configuration)
 * 8. Invoice Settings (invoice configuration)
 */
async function main() {
  console.log("\n🌱 Starting database seeding...\n");
  
  try {
    // 1. Super Admins
    await seedSuperAdmins(prisma);
    
    // 2. Email Templates
    await seedEmailTemplates(prisma);
    
    // 3. Notification Templates
    await seedNotificationTemplates(prisma);
    
    // 4. Notification Schedules
    await seedNotificationSchedules(prisma);
    
    // 5. Services & Plans
    await seedServices(prisma);
    
    // 6. Holidays
    await seedHolidays(prisma);
    
    // 7. App Settings
    await seedAppSettings(prisma);
    
    // 8. Invoice Settings
    await seedInvoiceSettings(prisma);
    
    console.log("\n✅ Database seeding completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

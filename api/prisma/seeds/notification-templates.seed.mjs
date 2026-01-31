/**
 * Notification Templates Seed Data
 * Creates notification templates linked to email templates
 */

export const notificationTemplatesData = [
  {
    id: "1",
    name: "otpRequest",
    channel: ["EMAIL"],
    emailTemplateId: "3",
  },
  {
    id: "2",
    name: "registeredUser",
    channel: ["EMAIL"],
    emailTemplateId: "4",
  },
  {
    id: "3",
    name: "registeredUs",
    channel: ["EMAIL"],
    emailTemplateId: "5",
  },
  {
    id: "4",
    name: "registeredOffer",
    channel: ["EMAIL"],
    emailTemplateId: "6",
  },
  {
    id: "5",
    name: "getInTouchUser",
    channel: ["EMAIL"],
    emailTemplateId: "7",
  },
  {
    id: "6",
    name: "getInTouchUs",
    channel: ["EMAIL"],
    emailTemplateId: "8",
  },
  {
    id: "7",
    isSchedulable: true,
    name: "subscriptionExpiringSoon",
    channel: ["EMAIL"],
    emailTemplateId: "9",
  },
  {
    id: "8",
    name: "subscriptionExpired",
    channel: ["EMAIL"],
    emailTemplateId: "10",
  }
];

export const notificationSchedulesData = [
  {
    id: "1",
    description: "Subscription expiring soon",
    daysBefore: [1, 2, 3],
    notificationTemplateId: "7",
  },
];

export async function seedNotificationTemplates(prisma) {
  console.log("🔔 Seeding notification templates...");
  
  try {
    for (const template of notificationTemplatesData) {
      await prisma.notificationTemplate.upsert({
        where: { id: template.id },
        update: {},
        create: template,
      });
      console.log(`  ✓ Created notification template: ${template.name}`);
    }

    console.log("✅ Notification templates seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding notification templates:", error);
    throw error;
  }
}

export async function seedNotificationSchedules(prisma) {
  console.log("📅 Seeding notification schedules...");
  
  try {
    for (const schedule of notificationSchedulesData) {
      await prisma.notificationSchedule.upsert({
        where: { id: schedule.id },
        update: {},
        create: schedule,
      });
      console.log(`  ✓ Created notification schedule: ${schedule.description}`);
    }

    console.log("✅ Notification schedules seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding notification schedules:", error);
    throw error;
  }
}

/**
 * Holidays Seed Data
 * Creates default holiday calendar for 2025
 */

export const holidaysData = [
  { name: "New Year's Day", date: new Date("2025-01-01") },
  { name: "Makar Sankranti", date: new Date("2025-01-14") },
  { name: "Republic Day", date: new Date("2025-01-26") },
  { name: "Holi", date: new Date("2025-03-14") },
  { name: "Ugadi", date: new Date("2025-03-30") },
  { name: "Eid-ul-Fitr", date: new Date("2025-04-10") },
  { name: "Ambedkar Jayanti", date: new Date("2025-04-14") },
  { name: "Good Friday", date: new Date("2025-04-18") },
  { name: "May Day", date: new Date("2025-05-01") },
  { name: "Eid-ul-Adha", date: new Date("2025-06-17") },
  { name: "Independence Day", date: new Date("2025-08-15") },
  { name: "Raksha Bandhan", date: new Date("2025-08-16") },
  { name: "Janmashtami", date: new Date("2025-08-27") },
  { name: "Ganesh Chaturthi", date: new Date("2025-09-05") },
  { name: "Gandhi Jayanti", date: new Date("2025-10-02") },
  { name: "Dussehra", date: new Date("2025-10-12") },
  { name: "Diwali", date: new Date("2025-10-20") },
  { name: "Guru Nanak Jayanti", date: new Date("2025-11-05") },
  { name: "Christmas", date: new Date("2025-12-25") }
];

export async function seedHolidays(prisma) {
  console.log("📅 Seeding holidays...");
  
  try {
    for (const holiday of holidaysData) {
      const existingHoliday = await prisma.holiday.findFirst({
        where: { date: holiday.date }
      });

      if (!existingHoliday) {
        await prisma.holiday.create({ data: holiday });
        console.log(`  ✓ Created holiday: ${holiday.name} (${holiday.date.toISOString().split('T')[0]})`);
      }
    }

    console.log("✅ Holidays seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding holidays:", error);
    throw error;
  }
}

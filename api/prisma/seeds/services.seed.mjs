/**
 * Services and Plans Seed Data
 * Creates service categories, services, and pricing plans
 */

export const serviceCategoriesData = [
  {
    name: "Desk Booking",
    description: "Co-Working Desks for flexible working spaces."
  },
  {
    name: "Virtual Office",
    description: "For Business & Mail Handling."
  },
  {
    name: "Private Office",
    description: "Dedicated spaces for teams of various sizes."
  }
];

export const servicesData = {
  "Desk Booking": [
    { name: "Open Desk", SAC: "998594" },
    { name: "Private Cabins", SAC: "998594" },
    { name: "Spacious Private Cabins", SAC: "998594" }
  ],
  "Virtual Office": [
    { name: "Company Registration", SAC: "998594" },
    { name: "Address Board", SAC: "998594" }
  ],
  "Private Office": [
    { name: "4 Members Cabin", SAC: "998594" },
    { name: "6 Members Cabin", SAC: "998594" },
    { name: "10 Members Cabin", SAC: "998594" },
    { name: "20 Members Cabin", SAC: "998594" }
  ]
};

export const plansData = {
  "Open Desk": [
    {
      name: "1 Day",
      features: ["Preferred Location Selection", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 500.00,
      defaultPrice: 500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.00,
      duration: "DAY",
      freeMeetingRoomSlots: 0
    },
    {
      name: "1 Month",
      features: ["Preferred Location Selection", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 5000.00,
      defaultPrice: 5000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.00,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Preferred Location Selection", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 4700.00,
      defaultPrice: 5000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.00,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Preferred Location Selection", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 4300.00,
      defaultPrice: 5000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.00,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "Private Cabins": [
    {
      name: "1 Day",
      features: ["Connected private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 600.00,
      defaultPrice: 600.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "DAY",
      freeMeetingRoomSlots: 0
    },
    {
      name: "1 Month",
      features: ["Connected private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 6000.00,
      defaultPrice: 6000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Connected private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 5600.00,
      defaultPrice: 6000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Connected private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 5000.00,
      defaultPrice: 6000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "Spacious Private Cabins": [
    {
      name: "1 Day",
      features: ["Spacious private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 700.00,
      defaultPrice: 700.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "DAY",
      freeMeetingRoomSlots: 0
    },
    {
      name: "1 Month",
      features: ["Spacious private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 7000.00,
      defaultPrice: 7000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 1,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Spacious private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 6600.00,
      defaultPrice: 7000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Spacious private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 6000.00,
      defaultPrice: 7000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "Company Registration": [
    {
      name: "12 Months",
      features: ["Legal Business Registration Assistance", "GST Registration Support", "Company Incorporation Assistance", "Enquiry & Call Handling", "Premium Business Address", "Courier Handling & Forwarding", "Business Documentation Support"],
      price: 2500.00,
      defaultPrice: 2500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "Address Board": [
    {
      name: "12 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 1500.00,
      defaultPrice: 1500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "4 Members Cabin": [
    {
      name: "1 Month",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 22000.00,
      defaultPrice: 22000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 20680.00,
      defaultPrice: 22000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 18700.00,
      defaultPrice: 22000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "6 Members Cabin": [
    {
      name: "1 Month",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 33000.00,
      defaultPrice: 33000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 31020.00,
      defaultPrice: 33000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 28050.00,
      defaultPrice: 33000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "10 Members Cabin": [
    {
      name: "1 Month",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 55000.00,
      defaultPrice: 55000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 51700.00,
      defaultPrice: 55000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 46750.00,
      defaultPrice: 55000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ],
  "20 Members Cabin": [
    {
      name: "1 Month",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 110000.00,
      defaultPrice: 110000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 103400.00,
      defaultPrice: 110000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 93500.00,
      defaultPrice: 110000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    }
  ]
};

export async function seedServices(prisma) {
  console.log("🏢 Seeding service categories, services, and plans...");
  
  try {
    // Seed service categories
    for (const category of serviceCategoriesData) {
      const existingCategory = await prisma.serviceCategory.findFirst({
        where: { name: category.name }
      });

      if (existingCategory) {
        await prisma.serviceCategory.update({
          where: { id: existingCategory.id },
          data: category
        });
      } else {
        await prisma.serviceCategory.create({ data: category });
      }
      console.log(`  ✓ Created service category: ${category.name}`);
    }

    // Seed services and plans
    for (const [categoryName, services] of Object.entries(servicesData)) {
      const category = await prisma.serviceCategory.findFirst({
        where: { name: categoryName }
      });

      for (const serviceData of services) {
        const existingService = await prisma.service.findFirst({
          where: {
            name: serviceData.name,
            categoryId: category.id
          }
        });

        let service;
        if (existingService) {
          service = await prisma.service.update({
            where: { id: existingService.id },
            data: { ...serviceData, categoryId: category.id }
          });
        } else {
          service = await prisma.service.create({
            data: { ...serviceData, categoryId: category.id }
          });
        }
        console.log(`    ✓ Created service: ${service.name}`);

        // Seed plans for this service
        const plans = plansData[serviceData.name] || [];
        for (const planData of plans) {
          const existingPlan = await prisma.plan.findFirst({
            where: {
              name: planData.name,
              serviceId: service.id
            }
          });

          if (existingPlan) {
            await prisma.plan.update({
              where: { id: existingPlan.id },
              data: { ...planData, serviceId: service.id }
            });
          } else {
            await prisma.plan.create({
              data: { ...planData, serviceId: service.id }
            });
          }
          console.log(`      ✓ Created plan: ${planData.name} for ${service.name}`);
        }
      }
    }

    console.log("✅ Services and plans seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding services:", error);
    throw error;
  }
}

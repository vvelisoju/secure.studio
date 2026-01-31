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

// Utility function to safely convert MJML to a single-line escaped string
const prepareMjmlForDB = (mjmlContent) => {
  return JSON.stringify(mjmlContent.replace(/\s+/g, ' ').trim());
};

// Function to extract content inside <mj-title>
function extractMjTitle(mjmlString) {
  const match = mjmlString.match(/<mj-title>(.*?)<\/mj-title>/s);
  return match ? match[1] : null; // Return content or null if not found
}

// Function to extract placeholders
function extractPlaceholders(mjmlString) {
  const matches = mjmlString.match(/{{(.*?)}}/g) || []; // Find all placeholders
  return [...new Set(matches.map(p => p.trim()))]; // Remove duplicates using Set
}

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert MJML templates to safe strings
const header = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/shared/header.mjml'), 'utf-8'));
const footer = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/shared/footer.mjml'), 'utf-8'));
const getInTouchUser = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/getInTouchUser.mjml'), 'utf-8'));
const getInTouchUs = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/getInTouchUs.mjml'), 'utf-8'));
const otpRequest = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/otpRequest.mjml'), 'utf-8'));
const RegisteredUser = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/registeredUser.mjml'), 'utf-8'));
const RegisteredUs = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/registeredUs.mjml'), 'utf-8'));
const RegisteredOffer = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/registeredOfferUser.mjml'), 'utf-8'));
const subscriptionExpiringSoon = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/subscriptionExpiringSoon.mjml'), 'utf-8'));
const subscriptionExpired = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/subscriptionExpired.mjml'), 'utf-8'));
// const newSubscription = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/newSubscription.mjml'), 'utf-8'));
// const updatedSubscription = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/updatedSubscription.mjml'), 'utf-8'));
// const meetingRoomConfirmation = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/meetingRoomConfirmation.mjml'), 'utf-8'));
// const companyInvitation = prepareMjmlForDB(await fs.readFile(path.resolve(__dirname, '../data/templates/companyInvitation.mjml'), 'utf-8'));

const prisma = new PrismaClient();


const notificationTemplates = [
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
]

const emailTemplates = [
  {
    id: "1",
    name: "header",
    defaultSubject: "",
    customizedSubject: "",
    defaultContent: header,
    customizedContent: header,
  },
  {
    id: "2",
    name: "footer",
    defaultSubject: "",
    customizedSubject: "",
    defaultContent: footer,
    customizedContent: footer,
  },
  {
    id: "3",
    name: "otpRequest",
    defaultSubject: extractMjTitle(otpRequest),
    customizedSubject: extractMjTitle(otpRequest),
    defaultContent: otpRequest,
    customizedContent: otpRequest,
    placeholders: extractPlaceholders(otpRequest)
  },
  {
    id: "4",
    name: "registeredUser",
    defaultSubject: extractMjTitle(RegisteredUser),
    customizedSubject: extractMjTitle(RegisteredUser),
    defaultContent: RegisteredUser,
    customizedContent: RegisteredUser,
    placeholders: extractPlaceholders(RegisteredUser)
  },
  {
    id: "5",
    name: "registeredUs",
    defaultSubject: extractMjTitle(RegisteredUs),
    customizedSubject: extractMjTitle(RegisteredUs),
    defaultContent: RegisteredUs,
    customizedContent: RegisteredUs,
    placeholders: extractPlaceholders(RegisteredUs)
  },
  {
    id: "6",
    name: "registeredOffer",
    defaultSubject: extractMjTitle(RegisteredOffer),
    customizedSubject: extractMjTitle(RegisteredOffer),
    defaultContent: RegisteredOffer,
    customizedContent: RegisteredOffer,
    placeholders: extractPlaceholders(RegisteredOffer)
  },
  {
    id: "7",
    name: "getInTouchUser",
    defaultSubject: extractMjTitle(getInTouchUser),
    customizedSubject: extractMjTitle(getInTouchUser),
    defaultContent: getInTouchUser,
    customizedContent: getInTouchUser,
    placeholders: extractPlaceholders(getInTouchUser)
  },
  {
    id: "8",
    name: "getInTouchUs",
    defaultSubject: extractMjTitle(getInTouchUs),
    customizedSubject: extractMjTitle(getInTouchUs),
    defaultContent: getInTouchUs,
    customizedContent: getInTouchUs,
    placeholders: extractPlaceholders(getInTouchUs)
  },
  {
    id: "9",
    name: "subscriptionExpiringSoon",
    defaultSubject: extractMjTitle(subscriptionExpiringSoon),
    customizedSubject: extractMjTitle(subscriptionExpiringSoon),
    defaultContent: subscriptionExpiringSoon,
    customizedContent: subscriptionExpiringSoon,
    placeholders: extractPlaceholders(subscriptionExpiringSoon)
  },
  {
    id: "10",
    name: "subscriptionExpired",
    defaultSubject: extractMjTitle(subscriptionExpired),
    customizedSubject: extractMjTitle(subscriptionExpired),
    defaultContent: subscriptionExpired,
    customizedContent: subscriptionExpired,
    placeholders: extractPlaceholders(subscriptionExpired)
  },
  // {
  //   id: "11",
  //   name: "companyInvitation",
  //   defaultSubject: extractMjTitle(companyInvitation),
  //   customizedSubject: extractMjTitle(companyInvitation),
  //   defaultContent:companyInvitation,
  //   customizedContent:companyInvitation,
  //   placeholders:extractPlaceholders(companyInvitation)
  // },
  // {
  //   id: "12",
  //   name: "meetingRoomConfirmation",
  //   defaultSubject: extractMjTitle(meetingRoomConfirmation),
  //   customizedSubject: extractMjTitle(meetingRoomConfirmation),
  //   defaultContent:meetingRoomConfirmation,
  //   customizedContent:meetingRoomConfirmation,
  //   placeholders:extractPlaceholders(meetingRoomConfirmation)
  // },
  // {
  //   id: "13",
  //   name: "newSubscription",
  //   defaultSubject: extractMjTitle(newSubscription),
  //   customizedSubject: extractMjTitle(newSubscription),
  //   defaultContent:newSubscription,
  //   customizedContent:newSubscription,
  //   placeholders:extractPlaceholders(newSubscription)
  // },
  // {
  //   id: "14",
  //   name: "updatedSubscription",
  //   defaultSubject: extractMjTitle(updatedSubscription),
  //   customizedSubject: extractMjTitle(updatedSubscription),
  //   defaultContent:updatedSubscription,
  //   customizedContent:updatedSubscription,
  //   placeholders:extractPlaceholders(updatedSubscription)
  // }
]

const notificationSchedules = [
  {
    id: "1",
    description: "Subscription expiring soon",
    daysBefore: [1, 2, 3],
    notificationTemplateId: "7",
  },
]

async function createUsers() {
  let user;
  try {
    const company = { id: "1f13a4d0-b848-4a77-86b2-195df1283f9d", name: "CodeVel", GSTIN: "36AAPFC5403Q1ZY", PAN: "", address: "39 2 40 NEAR GOVT SCHOOL SINGARAM WARANGAL URBAN INAVOLU SINGARAM WARDHANNAPET WARANGAL, Telangana, India - 506005", websiteUrl: "", employeeRange: "TWENTY_PLUS" };
    const newCompany = await prisma.company.upsert({ where: { id: company.id }, update: {}, create: company });
    const admin = { id: "8f048049-7cec-49f1-a004-ca5910a5f956", name: "venkateshwarlu velisoju", email: "vvelisoju121@gmail.com", userType: "USER", companyId: newCompany?.id };
    const admin2 = { id: "12ad3146-1d2b-483b-a8f2-327c7c86ae8e", name: "karthikeya maturi", email: "bunnymkk9+admin@gmail.com", userType: "USER", companyId: newCompany?.id };
    user = await prisma.user.upsert({ where: { id: admin?.id }, update: {}, create: admin });
    await prisma.superAdmin.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
    user = await prisma.user.upsert({ where: { id: admin2?.id }, update: {}, create: admin2 });
    await prisma.superAdmin.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  } catch (error) {
    console.error(`Error seeding user:`, error);
  }
}

async function createEmailTemplates() {
  const templates = emailTemplates;

  for (const template of templates) {
    try {
      await prisma.emailTemplate.upsert({
        where: { id: template.id },
        update: {},
        create: template,
      });
    } catch (error) {
      console.error(`Error seeding email templates ${template.name}:`, error);
    }
  }
}

async function createNotificationSchedules() {
  const schedules = notificationSchedules;

  for (const schedule of schedules) {
    try {
      await prisma.notificationSchedule.upsert({
        where: { id: schedule.id },
        update: {},
        create: schedule,
      });
    } catch (error) {
      console.error(`Error seeding schedules ${template.name}:`, error);
    }
  }
}


async function createNotificationTemplates() {
  const templates = notificationTemplates;

  for (const template of templates) {
    try {
      await prisma.notificationTemplate.upsert({
        where: { id: template.id },
        update: {},
        create: template,
      });
    } catch (error) {
      console.error(`Error seeding notification templates ${template.name}:`, error);
    }
  }
}

async function services() {
  // Define service category data
  const serviceCategories = [
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

  // Upsert service categories
  for (const category of serviceCategories) {
    // Find existing category by name
    const existingCategory = await prisma.serviceCategory.findFirst({
      where: {
        name: category.name
      }
    });

    if (existingCategory) {
      // Update existing category
      await prisma.serviceCategory.update({
        where: { id: existingCategory.id },
        data: category
      });
    } else {
      // Create new category
      await prisma.serviceCategory.create({
        data: category
      });
    }
  }

  // Get the category IDs after upsert
  const deskCategory = await prisma.serviceCategory.findFirst({ where: { name: "Desk Booking" } });
  const virtualCategory = await prisma.serviceCategory.findFirst({ where: { name: "Virtual Office" } });
  const officeCategory = await prisma.serviceCategory.findFirst({ where: { name: "Private Office" } });

  // Define services data
  const servicesData = [
    { name: "Open Desk", categoryId: deskCategory.id, SAC: "998594" },
    { name: "Private Cabins", categoryId: deskCategory.id, SAC: "998594" },
    { name: "Spacious Private Cabins", categoryId: deskCategory.id, SAC: "998594" },
    { name: "Company Registration", categoryId: virtualCategory.id, SAC: "998594" },
    { name: "Address Board", categoryId: virtualCategory.id, SAC: "998594" },
    { name: "4 Members Cabin", categoryId: officeCategory.id, SAC: "998594" },
    { name: "6 Members Cabin", categoryId: officeCategory.id, SAC: "998594" },
    { name: "10 Members Cabin", categoryId: officeCategory.id, SAC: "998594" },
    { name: "20 Members Cabin", categoryId: officeCategory.id, SAC: "998594" },
  ];

  // Upsert services
  const serviceMap = {};

  for (const serviceData of servicesData) {
    // Find existing service by name and categoryId
    const existingService = await prisma.service.findFirst({
      where: {
        name: serviceData.name,
        categoryId: serviceData.categoryId
      }
    });

    let service;

    if (existingService) {
      // Update existing service
      service = await prisma.service.update({
        where: { id: existingService.id },
        data: serviceData
      });
    } else {
      // Create new service
      service = await prisma.service.create({
        data: serviceData
      });
    }

    // Store service in map for plan reference
    serviceMap[serviceData.name] = service;
  }


  // Define plans data
  const plansData = [
    {
      name: "1 Day",
      serviceName: "Open Desk",
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
      serviceName: "Open Desk",
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
      serviceName: "Open Desk",
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
      serviceName: "Open Desk",
      features: ["Preferred Location Selection", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 4300.00,
      defaultPrice: 5000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.00,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "1 Day",
      serviceName: "Private Cabins",
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
      serviceName: "Private Cabins",
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
      serviceName: "Private Cabins",
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
      serviceName: "Private Cabins",
      features: ["Connected private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 5000.00,
      defaultPrice: 6000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "1 Day",
      serviceName: "Spacious Private Cabins",
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
      serviceName: "Spacious Private Cabins",
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
      serviceName: "Spacious Private Cabins",
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
      serviceName: "Spacious Private Cabins",
      features: ["Spacious private cabin", "Preferred Location Selection", "Locker & storage facility", "Full Amenities Access", "Networking", "Cleaning & Maintenance", "Noise & Distraction-Free Zones"],
      price: 6000.00,
      defaultPrice: 7000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      serviceName: "Company Registration",
      features: ["Legal Business Registration Assistance", " GST Registration Support", "Company Incorporation Assistance", "Enquiry & Call Handling", "Premium Business Address", "Courier Handling & Forwarding", "Business Documentation Support"],
      price: 2500.00,
      defaultPrice: 2500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      serviceName: "Address Board",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 1500.00,
      defaultPrice: 1500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "1 Month",
      serviceName: "4 Members Cabin",
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
      serviceName: "4 Members Cabin",
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
      serviceName: "4 Members Cabin",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 18700.00,
      defaultPrice: 22000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "1 Month",
      serviceName: "6 Members Cabin",
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
      serviceName: "6 Members Cabin",
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
      serviceName: "6 Members Cabin",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 28050.00,
      defaultPrice: 33000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "1 Month",
      serviceName: "10 Members Cabin",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 52500.00,
      defaultPrice: 52500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "6 Months",
      serviceName: "10 Members Cabin",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 49350.00,
      defaultPrice: 52500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 6,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "12 Months",
      serviceName: "10 Members Cabin",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 44625.00,
      defaultPrice: 52500.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
    {
      name: "1 Month",
      serviceName: "20 Members Cabin",
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
      serviceName: "20 Members Cabin",
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
      serviceName: "20 Members Cabin",
      features: ["Premium Business Address", "Address for Official Use", "Courier Handling & Forwarding", "Enquiry Support", "Flexible Plan Upgrade"],
      price: 93500.00,
      defaultPrice: 110000.00,
      gstType: "PERCENTAGE",
      gstValue: 18.0,
      defaultValue: 12,
      duration: "MONTH",
      freeMeetingRoomSlots: 1
    },
  ];



  // Upsert plans
  for (const planData of plansData) {
    const { serviceName, ...planDetails } = planData;
    const service = serviceMap[serviceName];

    if (!service) {
      console.error(`Service ${serviceName} not found for plan ${planData.name}`);
      continue;
    }

    // Find existing plan by name and serviceId
    const existingplan = await prisma.plan.findFirst({
      where: {
        name: planData.name,
        serviceId: service.id
      }
    });

    if (existingplan) {
      // Update existing plan
      await prisma.plan.update({
        where: { id: existingplan.id },
        data: {
          ...planDetails,
          serviceId: service.id
        }
      });
    } else {
      // Create new plan
      await prisma.plan.create({
        data: {
          ...planDetails,
          serviceId: service.id
        }
      });
    }
  }

  console.log("✅ Seeding services completed!");
}

async function seedHolidays() {
  const holidays = [
    { name: "New Year's Day", date: new Date('2024-12-31T18:30:00.000Z') }, // Jan 1, 2025 IST
    { name: 'Holi', date: new Date('2025-03-13T18:30:00.000Z') }, // March 14, 2025 IST
    { name: 'Ramzan', date: new Date('2025-03-30T18:30:00.000Z') }, // March 31, 2025 IST
    { name: 'May Day', date: new Date('2025-04-30T18:30:00.000Z') }, // May 1, 2025 IST
    { name: 'Raksha Bandhan', date: new Date('2025-08-08T18:30:00.000Z') }, // Aug 9, 2025 IST
    { name: 'Independence Day', date: new Date('2025-08-14T18:30:00.000Z') }, // Aug 15, 2025 IST
    { name: 'Ganesh Chaturthi', date: new Date('2025-08-26T18:30:00.000Z') }, // Aug 27, 2025 IST
    { name: 'Dussehra', date: new Date('2025-09-29T18:30:00.000Z') }, // Sept 30, 2025 IST
    { name: 'Dussehra', date: new Date('2025-10-01T18:30:00.000Z') }, // Oct 2, 2025 IST
    { name: 'Diwali', date: new Date('2025-10-19T18:30:00.000Z') }, // Oct 20, 2025 IST
    { name: 'Christmas', date: new Date('2025-12-24T18:30:00.000Z') }, // Dec 25, 2025 IST
  ];

  try {
    await prisma.holiday.createMany({ data: holidays, skipDuplicates: true });
  } catch (error) {
    console.error('Error seeding holidays:', error);
  }
}

const clearuserSubscriptions = async () => {
  await prisma.userSubscription.deleteMany();
}

const clearSubscriptions = async () => {
  await prisma.subscription.deleteMany();
}

const clearInvoices = async () => {
  await prisma.invoice.deleteMany();
}
const clearPayments = async () => {
  await prisma.payment.deleteMany();
}
const clearBookings = async () => {
  await prisma.booking.deleteMany();
}

const clearPlans = async () => {
  await prisma.plan.deleteMany();
}

const clearServices = async () => {
  await prisma.service.deleteMany();
}

const clearCategories = async () => {
  await prisma.serviceCategory.deleteMany();
}

const clearRefreshTokens = async () => {
  await prisma.refreshToken.deleteMany();
}

const clearCompanies = async () => {
  await prisma.company.deleteMany();
}
const clearUsers = async () => {
  await prisma.user.deleteMany();
}

const clearSlots = async () => {
  await prisma.timeSlot.deleteMany();
}

const clearMeetingRoomSettings = async () => {
  await prisma.meetingRoomSetting.deleteMany();
}

const clearAdvanceHistory = async () => {
  await prisma.advanceHistory.deleteMany();
}

const clearSignatures = async () => {
  await prisma.signature.deleteMany();

}

const clearDocuments = async () => {
  await prisma.document.deleteMany();

}

const clearSuperAdmins = async () => {
  await prisma.superAdmin.deleteMany();

}

const cleanUps = async () => {
  await clearSignatures();
  await clearDocuments();
  await clearAdvanceHistory();
  await clearSlots();
  await clearMeetingRoomSettings();
  await clearuserSubscriptions();
  await clearSubscriptions();
  await clearInvoices(),
    await clearPayments();
  await clearBookings();
  await clearPlans();
  await clearServices();
  await clearCategories();
  await clearRefreshTokens();
  await clearCompanies();
  // await clearSuperAdmins();
  // await clearUsers();
}

async function seedMeetingRoomSettings() {
  try {
    await prisma.meetingRoomSetting.upsert({
      where: { id: '3b0b8887-05d6-4bb9-ad7b-3160417e4a24' },
      update: {},
      create: {
        id: '3b0b8887-05d6-4bb9-ad7b-3160417e4a24',
        weekdays: [],
        startTime: '03:30',
        endTime: '12:30',
        slotDuration: 60,
        pricePerSlot: 150
      },
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

async function seedAppSettings() {
  try {
    await prisma.appSetting.upsert({
      where: { id: 'd7e6c23f-fccc-46ec-8a41-22d042511c15' },
      update: {},
      create: {
        id: 'd7e6c23f-fccc-46ec-8a41-22d042511c15',
        ccEmails: 'bunnymkk9+admin@gmail.com',
        gst: 18.0
      },
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

async function seedInvoiceSettings() {
  try {
    await prisma.invoiceSetting.upsert({
      where: { id: '27361009-6a9f-44a7-b531-46aefefacca8' },
      update: {},
      create: {
        id: '27361009-6a9f-44a7-b531-46aefefacca8',
        invoiceNumber: 100001,
        taxInvoiceNumber: 100001
      },
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}


async function upgradeInvoiceDetails() {
  try {
    const allInvoices = await prisma.invoice.findMany({
      include: {
        booking: {
          include: {
            service: true,
            payment: true,
            plan: true,
            invoice: true,
            user: {
              include: { company: true }
            },
            subscription: {
              select: { endTime: true, startTime: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    for (const invoice of allInvoices) {
      const booking = invoice.booking;

      if (!booking) continue; // skip if no booking

      // Example: extract values from booking to update invoice
      const bookingType = booking.bookingType || null;
      const dueDate = bookingType !== "MEETING_ROOM" && booking.subscription.endTime;
      const effectiveDate = bookingType !== "MEETING_ROOM" && booking.subscription.startTime;
      const perQuantityAmount = parseFloat((invoice.totalAmount / booking.quantity).toFixed(2));
      const SAC = booking.service.SAC || null;
      const HSN = booking.service.HSN || null;
      const serviceName = booking.service?.name || null;

      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          dueDate,
          effectiveDate,
          description: bookingType === "MEETING_ROOM" ? " Meeting Room" : serviceName,
          SAC,
          HSN,
          perQuantityAmount,
          quantity: booking.quantity,
          taxableAmount: parseFloat((invoice.totalAmount - (invoice.discount || 0)).toFixed()),
          gst: 18,
        }
      });
    }

    console.log("Invoice upgrade completed.");
  } catch (error) {
    console.error("Failed to upgrade invoices:", error);
  }
}

async function seedAccountSettings() {
  try {
    await prisma.account.upsert({
      where: { id: 'f64d683e-ebe0-49b6-8241-fcb5f17ae466' },
      update: {},
      create: {
        id: 'f64d683e-ebe0-49b6-8241-fcb5f17ae466',
        accountHolder: "CODEVEL TECHNOLOGIES LLP",
        accountNumber: "50200057491620",
        IFSC: "HDFC0000375",
        Branch: "HANUMAKONDA",
        accountType: "CURRENT",
        virtualPaymentAddress: "7287820821@hdfcbank",
        companyId: "1f13a4d0-b848-4a77-86b2-195df1283f9d"
      },
    });
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

async function updateAllInvoicesWithItemJson() {
  try {
    // 1. Fetch all invoices
    const invoices = await prisma.invoice.findMany();

    // 2. Loop through each invoice
    for (const invoice of invoices) {
      const {
        id,
        description,
        quantity,
        perQuantityAmount,
        totalAmount
      } = invoice;

      // 3. Construct item JSON
      const item = {
        id: uuidv4(),
        description,
        quantity,
        rate: perQuantityAmount,
        amount: perQuantityAmount * quantity,
      };

      // 4. Update each invoice with itemsJson
      await prisma.invoice.update({
        where: { id },
        data: {
          itemsJson: [item],
        },
      });

      console.log(`Updated invoice ${id} with itemsJson`);
    }

    console.log("✅ All invoices updated successfully.");
  } catch (error) {
    console.error("❌ Error updating invoices:", error);
  }
}


async function backfillBookingSubscriptionIds() {
  try {
    // 1. Get all subscriptions with their bookingId
    const subscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        bookingId: true,
      },
    });

    for (const subscription of subscriptions) {
      // 2. Fetch the booking record
      const booking = await prisma.booking.findUnique({
        where: { id: subscription.bookingId },
        select: { subscriptionId: true },
      });

      // 3. If booking exists and doesn't have a subscriptionId, update it
      if (booking && !booking.subscriptionId) {
        await prisma.booking.update({
          where: { id: subscription.bookingId },
          data: { subscriptionId: subscription.id },
        });
        console.log(`Updated booking ${subscription.bookingId} with subscription ${subscription.id}`);
      }
    }

    console.log('✅ Backfill completed.');
  } catch (error) {
    console.error('❌ Error during backfill:', error);
  }
}


async function main() {
  try {
    // Call seeding functions
    // await createUsers();
    // await seedAppSettings();
    // await createEmailTemplates();
    // await createNotificationTemplates();
    // await createNotificationSchedules();
    // await services();
    // await seedHolidays();
    // await seedMeetingRoomSettings();
    // await seedAccountSettings();
    // await seedInvoiceSettings();
    // updateAllInvoicesWithItemJson();
    backfillBookingSubscriptionIds();
    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect(); // Ensures the connection is closed
  }
}




main();
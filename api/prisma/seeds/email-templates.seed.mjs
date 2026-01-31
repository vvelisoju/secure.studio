/**
 * Email Templates Seed Data
 * Loads MJML email templates from files and creates database records
 */

import fs from 'fs-extra';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to safely convert MJML to a single-line escaped string
const prepareMjmlForDB = (mjmlContent) => {
  return JSON.stringify(mjmlContent.replace(/\s+/g, ' ').trim());
};

// Function to extract content inside <mj-title>
function extractMjTitle(mjmlString) {
  const match = mjmlString.match(/<mj-title>(.*?)<\/mj-title>/s);
  return match ? match[1] : null;
}

// Function to extract placeholders
function extractPlaceholders(mjmlString) {
  const matches = mjmlString.match(/{{(.*?)}}/g) || [];
  return [...new Set(matches.map(p => p.trim()))];
}

// Load email templates
async function loadEmailTemplates() {
  const templatesPath = path.resolve(__dirname, '../../data/templates');
  
  const header = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'shared/header.mjml'), 'utf-8'));
  const footer = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'shared/footer.mjml'), 'utf-8'));
  const getInTouchUser = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'getInTouchUser.mjml'), 'utf-8'));
  const getInTouchUs = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'getInTouchUs.mjml'), 'utf-8'));
  const otpRequest = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'otpRequest.mjml'), 'utf-8'));
  const RegisteredUser = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'registeredUser.mjml'), 'utf-8'));
  const RegisteredUs = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'registeredUs.mjml'), 'utf-8'));
  const RegisteredOffer = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'registeredOfferUser.mjml'), 'utf-8'));
  const subscriptionExpiringSoon = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'subscriptionExpiringSoon.mjml'), 'utf-8'));
  const subscriptionExpired = prepareMjmlForDB(await fs.readFile(path.join(templatesPath, 'subscriptionExpired.mjml'), 'utf-8'));

  return [
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
    }
  ];
}

export async function seedEmailTemplates(prisma) {
  console.log("📧 Seeding email templates...");
  
  try {
    const templates = await loadEmailTemplates();

    for (const template of templates) {
      await prisma.emailTemplate.upsert({
        where: { id: template.id },
        update: {},
        create: template,
      });
      console.log(`  ✓ Created email template: ${template.name}`);
    }

    console.log("✅ Email templates seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding email templates:", error);
    throw error;
  }
}

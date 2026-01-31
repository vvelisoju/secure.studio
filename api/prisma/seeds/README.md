# Database Seeding

This directory contains modular seed files for initializing the database with default data.

## Structure

```
prisma/
├── seed.mjs                          # Legacy seed file (deprecated)
├── seed-new.mjs                      # Main seed orchestrator
└── seeds/
    ├── superadmin.seed.mjs          # Super admin users and company
    ├── email-templates.seed.mjs     # Email templates (MJML)
    ├── notification-templates.seed.mjs  # Notification templates & schedules
    ├── services.seed.mjs            # Service categories, services, and plans
    ├── holidays.seed.mjs            # Holiday calendar
    └── app-settings.seed.mjs        # App and invoice settings
```

## Seed Order

Seeds are executed in dependency order:

1. **Super Admins** - Creates default company and admin users
2. **Email Templates** - Loads MJML email templates
3. **Notification Templates** - Creates notification templates
4. **Notification Schedules** - Creates scheduled notifications
5. **Services & Plans** - Creates service categories, services, and pricing plans
6. **Holidays** - Creates holiday calendar for 2025
7. **App Settings** - Creates application configuration
8. **Invoice Settings** - Creates invoice configuration

## Usage

### Run All Seeds

```bash
npm run prisma:seed
# or
npx prisma db seed
```

### Run Specific Seed (for development)

```javascript
import { PrismaClient } from "@prisma/client";
import { seedSuperAdmins } from "./seeds/superadmin.seed.mjs";

const prisma = new PrismaClient();
await seedSuperAdmins(prisma);
await prisma.$disconnect();
```

## Modifying Seed Data

### Adding New Super Admins

Edit `seeds/superadmin.seed.mjs`:

```javascript
export const superAdminData = {
  company: { /* company data */ },
  admins: [
    { id: "...", name: "...", email: "...", userType: "USER" }
  ]
};
```

### Adding New Services

Edit `seeds/services.seed.mjs`:

```javascript
export const servicesData = {
  "Category Name": [
    { name: "Service Name", SAC: "998594" }
  ]
};

export const plansData = {
  "Service Name": [
    { name: "1 Month", price: 5000.00, /* ... */ }
  ]
};
```

### Adding New Holidays

Edit `seeds/holidays.seed.mjs`:

```javascript
export const holidaysData = [
  { date: new Date("2025-01-01"), description: "New Year's Day" }
];
```

### Adding New Email Templates

1. Create MJML file in `data/templates/`
2. Add to `seeds/email-templates.seed.mjs`

## Best Practices

1. **Idempotent Seeds** - All seeds use `upsert` to be safely re-runnable
2. **Fixed IDs** - Use fixed UUIDs for reference data to maintain relationships
3. **Modular Structure** - Each seed file handles one domain
4. **Error Handling** - Each seed function has try-catch with descriptive errors
5. **Logging** - Clear console output shows progress

## Migration from Legacy Seed

The old `seed.mjs` file is deprecated. To use the new modular system:

1. Update `package.json`:
   ```json
   "prisma": {
     "seed": "node prisma/seed-new.mjs"
   }
   ```

2. Run seeds:
   ```bash
   npx prisma db seed
   ```

## Troubleshooting

### Seed Fails with "Template not found"

Ensure MJML template files exist in `data/templates/`

### Seed Fails with "Foreign key constraint"

Check seed execution order - dependencies must be seeded first

### Duplicate Key Errors

Seeds use `upsert` - if you see this error, check for duplicate IDs in seed data

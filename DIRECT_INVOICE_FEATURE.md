# Direct Invoice Generation Feature

## Overview
This feature enables administrators to generate invoices directly for users without requiring a subscription or booking. This is useful for one-time services, custom billing, or ad-hoc charges.

## Feature Location
**User Management Page** → **Actions Column** → **Invoice Icon Button**

## How It Works

### User Interface Flow
1. Navigate to the **Users** page (`/users`)
2. Locate the user in the table
3. Click the **Invoice icon** in the Actions column
4. A full-screen modal opens with the invoice editor
5. User and company details are **automatically pre-filled**
6. Add line items with description, quantity, and rate
7. Click **Generate Invoice** to save

### Pre-filled Information
When the modal opens, the following fields are automatically populated:

**Bill To (User Details):**
- Company name or user name
- Company/user address
- GSTIN number (if available)
- Contact person name
- Mobile number

**Bill From (Admin Details):**
- Fetched from admin profile
- Company details and GSTIN

**Default Values:**
- Invoice date: Today's date
- Due date: One month from today
- CGST: From app settings (default 9%)
- SGST: From app settings (default 9%)

## Technical Implementation

### Backend Changes

#### 1. New API Endpoint
**Route:** `POST /api/invoice/direct`

**Controller:** `api/controllers/invoice.ts`
```typescript
async createDirectInvoice(req: Request, res: Response)
```

**Features:**
- Auto-generates invoice code from invoice settings
- Increments invoice number counter (tax/non-tax)
- Creates invoice without booking/subscription dependency
- Supports both TAXABLE and NON_TAXABLE invoice types

#### 2. Database Schema
The existing `Invoice` model already supports direct invoices:
- `bookingId` is **optional** (nullable)
- `userId` links invoice directly to user
- No schema changes required

### Frontend Changes

#### 1. New Component
**File:** `app/src/components/users/directInvoiceModal.tsx`

**Features:**
- Full-screen modal dialog
- Integrates existing `InvoiceEditor` component
- Auto-populates user/company details
- Handles invoice creation and validation
- Proper state management and cleanup

#### 2. API Integration
**File:** `app/src/api/invoices.tsx`

New function:
```typescript
export const createDirectInvoice(data: any)
```

#### 3. UI Integration
**File:** `app/src/pages/users.tsx`

- Added `DirectInvoiceModal` component to Actions column
- Invoice icon appears for all users
- Positioned before email and delete actions

## Invoice Data Structure

### Required Fields
- `userId`: User ID (auto-filled)
- `effectiveDate`: Invoice date
- `dueDate`: Payment due date
- `description`: Item description
- `quantity`: Item quantity
- `rate`: Per unit rate
- `totalAmount`: Line item total
- `taxableAmount`: Subtotal before tax
- `cgst`: CGST percentage
- `sgst`: SGST percentage
- `cgstAmount`: Calculated CGST amount
- `sgstAmount`: Calculated SGST amount
- `finalAmount`: Total including taxes
- `type`: TAXABLE or NON_TAXABLE
- `itemsJson`: Array of line items
- `headingsJson`: Custom field labels

### Optional Fields
- `poNumber`: Purchase order number
- `periodOfService`: Service period
- `amountPaid`: Amount already paid
- `balanceDue`: Remaining balance
- `SAC`: Service Accounting Code

## Invoice Number Generation

The system automatically generates sequential invoice numbers:

- **Tax Invoices:** Uses `taxInvoiceNumber` from invoice settings
- **Non-Tax Invoices:** Uses `invoiceNumber` from invoice settings
- Counter increments after successful creation
- Format: Stored as JSON string in database

## Validation

The modal validates:
1. Date and due date must be filled
2. At least one line item with description required
3. User must exist and be valid
4. All calculations must be accurate

## Benefits

### No Subscription Required
- Generate invoices for one-time services
- Bill for custom work or additional charges
- Handle special cases outside normal subscription flow

### Streamlined Workflow
- Direct access from user table
- Pre-filled user information
- Familiar invoice editor interface
- Automatic invoice numbering

### Data Integrity
- Proper invoice tracking
- Maintains invoice number sequence
- Links directly to user record
- Supports both tax and non-tax invoices

## Usage Examples

### Example 1: One-Time Service
User needs a meeting room for a special event outside their subscription:
1. Click invoice icon for the user
2. Add item: "Special Event Meeting Room - 5 hours"
3. Set quantity: 5, rate: 500
4. Generate invoice

### Example 2: Custom Billing
User requires custom development work:
1. Click invoice icon
2. Add item: "Custom Feature Development"
3. Set quantity: 1, rate: 25000
4. Add PO number if applicable
5. Generate invoice

### Example 3: Additional Charges
User exceeded their subscription limits:
1. Click invoice icon
2. Add item: "Additional Storage - 50GB"
3. Set quantity: 50, rate: 10
4. Generate invoice

## Regression Prevention

### No Impact on Existing Features
- Subscription-based invoices continue to work normally
- Booking flow remains unchanged
- Invoice listing and viewing unaffected
- Payment processing not modified

### Database Compatibility
- Uses existing Invoice model
- No schema migrations required
- Backward compatible with all existing invoices

### UI Consistency
- Uses existing InvoiceEditor component
- Follows current design patterns
- Maintains Chakra UI styling
- Consistent with existing modals

## Testing Checklist

- [ ] Invoice icon appears in user table
- [ ] Modal opens with pre-filled user details
- [ ] Can add multiple line items
- [ ] Tax calculations are correct
- [ ] Invoice saves successfully
- [ ] Invoice number increments properly
- [ ] Invoice appears in user's invoice list
- [ ] Both tax and non-tax invoices work
- [ ] Modal closes and resets properly
- [ ] Validation errors display correctly
- [ ] Existing subscription invoices still work
- [ ] No console errors

## Future Enhancements

Potential improvements:
1. Invoice templates for common services
2. Bulk invoice generation
3. Recurring invoice scheduling
4. Invoice preview before saving
5. Email invoice directly to user
6. PDF download from modal
7. Invoice editing capability
8. Invoice cancellation/void

## Support

For issues or questions:
1. Check console for error messages
2. Verify user has valid company details
3. Ensure invoice settings are configured
4. Check app settings for GST values
5. Verify admin profile is complete

## Files Modified/Created

### Backend
- ✅ `api/controllers/invoice.ts` - Added `createDirectInvoice` method
- ✅ `api/routes/invoice.ts` - Added POST `/direct` route

### Frontend
- ✅ `app/src/components/users/directInvoiceModal.tsx` - New modal component
- ✅ `app/src/api/invoices.tsx` - Added `createDirectInvoice` API function
- ✅ `app/src/pages/users.tsx` - Integrated modal into user table

### Documentation
- ✅ `DIRECT_INVOICE_FEATURE.md` - This file

## Conclusion

This feature provides a flexible, user-friendly way to generate invoices outside the standard subscription workflow while maintaining data integrity and following existing design patterns. The implementation leverages existing components and services, ensuring minimal code duplication and maximum maintainability.

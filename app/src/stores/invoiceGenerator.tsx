import { create } from "zustand";
import { getInvoiceSetting } from "../api/invoiceSetting";

interface InvoiceGeneratorState {
    logoUrl: string,
    type: string,
    type2: string,
    type3: string,
    h1: string,
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
    h7: string;
    h8: string,
    h9: string;
    h10: string;
    h11: string;
    h12: string;
    h13: string;
    h14: string;
    h15: string;
    h16: string;
    tab: any;
    billFrom: string,
    billFromDetails: string,
    billTo: string,
    billToDetails: string,
    periodOfService: string,
    date: string;
    dueDate: string;
    poNumber: string;
    balanceDue: number;
    subTotal: number;
    total: number,
    amountPaid: number,
    CGST: number,
    SGST: number,
    CGSTAmount: number,
    SGSTAmount: number,
    items: any;
    terms: string;
    code: string;
    setItems: (items: any) => void;
    downloadInvoiceId: string;
    downloadPreviewInvoice: (id: string) => void;

    // Individual setters
    setLogoUrl: (url: string) => void;
    setType: (value: string) => void;
    setType2: (value: string) => void;
    setType3: (value: string) => void;
    setH1: (value: string) => void;
    setH2: (value: string) => void;
    setH3: (value: string) => void;
    setH4: (value: string) => void;
    setH5: (value: string) => void;
    setH6: (value: string) => void;
    setH7: (value: string) => void;
    setH8: (value: string) => void;
    setH9: (value: string) => void;
    setH10: (value: string) => void;
    setH11: (value: string) => void;
    setH12: (value: string) => void;
    setH13: (value: string) => void;
    setH14: (value: string) => void;
    setH15: (value: string) => void;
    setH16: (value: string) => void;
    setTab: (value: any) => Promise<void>;
    setBillFrom: (value: string) => void;
    setBillFromDetails: (value: string) => void;
    setBillTo: (value: string) => void;
    setBillToDetails: (value: string) => void;
    setPeriodOfService: (value: string) => void;
    setDate: (value: string) => void;
    setDueDate: (value: string) => void;
    setPoNumber: (value: string) => void;
    setBalanceDue: (value: number) => void;
    setSubTotal: () => void;
    setCGST: (value: number) => void;
    setSGST: (value: number) => void;
    setTotal: () => void;
    setAmountPaid: (value: number) => void;
    setTerms: (value: string) => void;
    setCode: (value: string) => void;
    setDownloadInvoiceId: (value: string) => void;
}

// Zustand Store
export const useInvoiceGeneratorStore = create<InvoiceGeneratorState>((set, get) => ({
    code: "",
    logoUrl: "",
    type: "INVOICE",
    type2: "PERCENTAGE",
    type3: "PERCENTAGE",
    h1: "Bill To",
    h2: "Period Of Service",
    h3: "Date",
    h4: "Due Date",
    h5: "PO Number",
    h6: "Balance Due",
    h7: "Item",
    h8: "Quantity",
    h9: "Rate",
    h10: "Amount",
    h11: "Subtotal",
    h12: "CGST",
    h13: "SGST",
    h14: "Total",
    h15: "Amount Paid",
    h16: "Terms",
    tab: "INVOICE",
    billFrom: "",
    billFromDetails: "",
    billTo: "",
    billToDetails: "",
    periodOfService: "",
    date: "",
    dueDate: "",
    poNumber: "",
    balanceDue: 0,
    subTotal: 0,
    total: 0,
    amountPaid: 0,
    CGST: 0,
    SGST: 0,
    CGSTAmount: 0,
    SGSTAmount: 0,
    terms: `1. Payment Terms
All payments must be made in advance as per the agreed membership plan.
Charges are exclusive of GST and other applicable taxes, which will be added separately.
Additional services (Meeting Hall, Conference Hall, Overtime, etc.) will be billed separately.
Payment must be completed by the due date mentioned in the invoice.

2. Late Payment Policy
A late fee of ₹1000 per day applies for overdue payments.
Services may be suspended if payment is delayed beyond three (3) days.

3. Refund & Security Deposit
No refunds will be issued for early termination.
Security deposit (if applicable) will be refunded within fifteen (15) days after adjusting any dues or damages as mentioned in the agreement.

4. Taxes
GST and other applicable taxes will be charged in addition to the quoted prices.

5. Acceptance of Terms
Payment of this invoice confirms the Client’s acceptance of these Terms and the Co-Working Space Usage Agreement.

`,
    items: [],
    setItems: (items) => set({ items }),
    downloadInvoiceId: "",
    downloadPreviewInvoice: async () => {
        // const { invoicePreview, } = get();
        // const a = document.createElement("a");
        // a.href = invoicePreview;
        // a.download = `invoice-${id}.png`;
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
    },
    // Setters
    setLogoUrl: (url) => set({ logoUrl: url }),
    setType: (value) => set({ type: value }),
    setType2: (value) => set({ type2: value }),
    setType3: (value) => set({ type3: value }),
    setH1: (value) => set({ h1: value }),
    setH2: (value) => set({ h2: value }),
    setH3: (value) => set({ h3: value }),
    setH4: (value) => set({ h4: value }),
    setH5: (value) => set({ h5: value }),
    setH6: (value) => set({ h6: value }),
    setH7: (value) => set({ h7: value }),
    setH8: (value) => set({ h8: value }),
    setH9: (value) => set({ h9: value }),
    setH10: (value) => set({ h10: value }),
    setH11: (value) => set({ h11: value }),
    setH12: (value) => set({ h12: value }),
    setH13: (value) => set({ h13: value }),
    setH14: (value) => set({ h14: value }),
    setH15: (value) => set({ h15: value }),
    setH16: (value) => set({ h16: value }),
    setTab: async (value) => {
        const { tab } = get();
        const settings = await getInvoiceSetting();
        const response = await settings.data;
        set({ tab: value, code: tab === "TAXINVOICE" ? response.taxInvoiceNumber : response.invoiceNumber })
    },
    setBillFrom: (value) => set({ billFrom: value }),
    setBillFromDetails: (value) => set({ billFromDetails: value }),
    setBillTo: (value) => set({ billTo: value }),
    setBillToDetails: (value) => set({ billToDetails: value }),
    setPeriodOfService: (value) => set({ periodOfService: value }),
    setDate: (value) => set({ date: value }),
    setDueDate: (value) => set({ dueDate: value }),
    setPoNumber: (value) => set({ poNumber: value }),
    setBalanceDue: (value) => set({ balanceDue: value }),
    setCode: (value) => set({ code: value }),
    setSubTotal: () => {
        const { items, CGST, SGST, amountPaid } = get();
        let value = 0;
        items.map((item: any) => {
            value += item.amount
        });

        // CGST
        const { total, type2 } = get();
        let CGSTAmount = 0;
        if (type2 === "PERCENTAGE") {
            CGSTAmount = value * CGST / 100
        } else {
            CGSTAmount = CGST
        }

        // SGST 
        let SGSTAmount = 0;
        if (type2 === "PERCENTAGE") {
            SGSTAmount = value * SGST / 100
        } else {
            SGSTAmount = SGST
        }

        set({ subTotal: value, total: value + CGSTAmount + SGSTAmount, balanceDue: (value + SGSTAmount + CGSTAmount) - amountPaid });
    },
    setCGST: (value) => {
        const { subTotal, SGSTAmount, type2, amountPaid } = get();
        let CGSTAmount = 0;
        if (type2 === "PERCENTAGE") {
            CGSTAmount = subTotal * value / 100
        } else {
            CGSTAmount = value
        }
        set({ total: subTotal + CGSTAmount + SGSTAmount, CGST: value, CGSTAmount, balanceDue: (subTotal + CGSTAmount + SGSTAmount) - amountPaid });
    },
    setSGST: (value) => {
        const { CGSTAmount, subTotal, type2, amountPaid } = get();
        let SGSTAmount = 0;
        if (type2 === "PERCENTAGE") {
            SGSTAmount = subTotal * value / 100
        } else {
            SGSTAmount = value
        }
        set({ total: subTotal + SGSTAmount + CGSTAmount, SGST: value, SGSTAmount, balanceDue: (subTotal + SGSTAmount + CGSTAmount) - amountPaid });
    },
    setTotal: () => { },
    setAmountPaid: (value) => {
        const { total } = get();
        const balanceDue = total - value;
        set({ balanceDue, amountPaid: value })
    },
    setTerms: (value) => set({ terms: value }),
    setDownloadInvoiceId: (value) => set({ downloadInvoiceId: value })

}));

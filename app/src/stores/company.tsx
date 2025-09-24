import { create } from "zustand";
import { getCompanyDetails } from "../api/company";
import { useInvoiceEditStore } from "./invoiceEdit";
import { useInvoiceGeneratorStore } from "./invoiceGenerator";

interface SubscriptionState {
    company: any;
    fetchCompanyDetails: () => Promise<void>;
}

// Zustand Store
export const useCompanyStore = create<SubscriptionState>((set) => ({
    company: {},
    fetchCompanyDetails: async () => {
        const response = await getCompanyDetails();
        
        // Update invoice generator store
        useInvoiceGeneratorStore.getState().setBillFrom(response?.data?.name);
        useInvoiceGeneratorStore.getState().setBillFromDetails(`${response?.data?.address}\nGSTIN No: ${response?.data?.GSTIN}`);
        // Update invoice edit store
        useInvoiceEditStore.getState().setBillFrom(response?.data?.name);
        useInvoiceEditStore.getState().setBillFromDetails(`${response?.data?.address}\nGSTIN No: ${response?.data?.GSTIN}`);

        set({ company: response?.data });
    },
}));

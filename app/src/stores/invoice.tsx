import { create } from "zustand";
import { fetchInvoices } from "../api/invoices";
import { useUserStore } from "./users";

interface Invoice {
    id: string;
    description: string,
    SAC: string,
    HSN: string,
    perQuantityAmount: number,
    quantity: number,
    taxableAmount: number,
    gst: number,
    totalAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    discount: number;
    finalAmount: number;
    booking: any;
    createdAt: string;
}

interface InvoiceState {
    invoicePreview: any;
    invoices: Invoice[];
    page: number;
    totalPages: number;
    pageSize: number;
    loading: boolean;
    downloadLoding: boolean;
    fetchInvoices: (page?: number) => Promise<void>;
    setPage: (page: number) => void;
    downloadInvoiceId: string;
    downloadPreviewInvoice: (id: string) => void;

}

// Zustand Store
export const useInvoicesStore = create<InvoiceState>((set, get) => ({
    invoicePreview: undefined,
    invoices: [],
    page: 1,
    totalPages: 1,
    pageSize: 10,
    loading: false,
    downloadLoding: false,
    fetchInvoices: async (page = 1) => {
        set({ loading: true });
        const { pageSize } = get();
        const { userId } = useUserStore.getState();
        const response = await fetchInvoices(userId, page, pageSize);
        set({ invoices: response.data.invoices, totalPages: response.data.totalCount, loading: false, page });

    },
    setPage: (page) => set({ page }),
    downloadInvoiceId: "",
    downloadPreviewInvoice: async (id) => {
        const { invoicePreview, } = get();
        const a = document.createElement("a");
        a.href = invoicePreview;
        a.download = `invoice-${id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}));

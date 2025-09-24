import { create } from "zustand";
import { getAdvancesListOfUser, updateData, addData } from "../api/advanceHistory";

enum AdvanceTransactionType {
    GIVEN,// Advance amount given
    REPAID,// Advance amount repaid
    ADJUSTMENT // Manual adjustment
}

interface AdvanceHistory {
    id: string;
    userId: string;
    amount: number;
    type: AdvanceTransactionType;
    description?: string;
    createdAt: string;
}


interface AdvanceHistoryState {
    loading: Boolean;
    setLoading: (value: Boolean) => void;
    total: any;
    creditedList: AdvanceHistory[];
    fetchAdvances: (userId?: any) => Promise<void>;
    updateAdvance: (data: any) => Promise<void>;
    addAdvance: (data: any) => Promise<void>;
    receiptDownload: any;
    setReceiptDownload: (data: any) => void;
}

// Zustand Store
export const useAdvanceHistory = create<AdvanceHistoryState>((set) => ({
    loading: true,
    setLoading: (value) => set({ loading: value }),
    creditedList: [],
    total: 0,
    fetchAdvances: async (userId) => {
        const response = await getAdvancesListOfUser(userId);
        set({ creditedList: response?.data.history, total: response?.data.total, loading: false });
    },
    updateAdvance: async (data) => {
        const response = await updateData(data);
        return response;
    },
    addAdvance: async (data) => {
        const response = await addData(data);
        return response;
    },
    receiptDownload: {},
    setReceiptDownload: (data: any) => set({ receiptDownload: data })
}));

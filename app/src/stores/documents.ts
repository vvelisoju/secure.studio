import { create } from "zustand";
import { fetchUserDocuments } from "../api/document";
import { useUserStore } from "./users";

interface DocumentState {
    documentIds: string[];
    documents: any[];
    loading: boolean;
    fetchDocuments: () => Promise<void>;
}

// Zustand Store
export const useDocumentsStore = create<DocumentState>((set) => ({
    documentIds: [],
    documents: [],
    loading: false,

    fetchDocuments: async () => {
        set({ loading: true });
        const { userId } = useUserStore.getState(); // Get user ID from user store
        try {
            const documents = await fetchUserDocuments(userId);
            const ids = documents.map((doc: any) => doc.id); // Extract document IDs
            set({ documents: documents, documentIds: ids, loading: false });
        } catch (error) {
            console.error("Error fetching documents:", error);
            set({ loading: false });
        }
    },
}));

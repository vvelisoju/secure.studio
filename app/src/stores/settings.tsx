import { create } from "zustand";
import {
    fetchUser, updateUser,
    deleteProfile, replaceProfile, uploadProfile,
    deleteLogo, replaceLogo, uploadLogo,
    updateCompany
} from "../api/settings";
import { useUserStore } from "./users";
import { useInvoiceGeneratorStore } from "./invoiceGenerator";
import { useInvoiceEditStore } from "./invoiceEdit";

interface SettingsState {
    profileUpdated: boolean,
    adminProfileDetails: any,
    profileDetails: any,
    companyDetails: any,
    editProfile: boolean,
    editCompany: boolean,
    fetchAdminProfileDetails: () => Promise<void>,
    fetchProfileDetails: () => Promise<void>,
    editProfileDetails: (data: any) => Promise<void>,
    editCompanyDetails: (data: any) => Promise<void>,
    deleteProfileImage: (data: any) => Promise<void>,
    replaceProfileImage: (data: any) => Promise<void>,
    uploadProfileImage: (data: any) => Promise<void>,
    deleteLogo: (data: any) => Promise<void>,
    replaceLogo: (data: any) => Promise<void>,
    uploadLogo: (data: any) => Promise<void>,
    setEditProfile: (value: boolean) => void,
    setEditCompany: (value: boolean) => void,
    reset: () => void;
    tab: string;
    setTab: (data: any) => void;
}

// Zustand Store
export const useSettingsStore = create<SettingsState>((set) => ({
    profileUpdated: false,
    adminProfileDetails: undefined,
    profileDetails: undefined,
    profileDetailsOfCutsomer: undefined,
    companyDetails: undefined,
    editProfile: false,
    editCompany: false,
    setEditProfile: (value) => set({ editProfile: value }),
    setEditCompany: (value) => set({ editCompany: value }),
    fetchProfileDetails: async () => {
        const { userId } = useUserStore.getState();
        const response = await fetchUser(userId);

        set({ profileDetails: response.data, companyDetails: response.data.company });
        // Update invoice generator store
        useInvoiceEditStore.getState().setBillTo(response?.data?.company?.name || response?.data?.name);
        useInvoiceEditStore.getState().setBillToDetails(`${response?.data?.company?.address || response?.data?.address || ""}\n${response?.data?.company?.GSTIN ? "GSTIN No: " + response?.data?.company?.GSTIN : ""}\n${response?.data?.name ? "Contact Person: " + response?.data?.name : ""}\n${response?.data?.phone? "Mobile: " + response?.data?.phone : ""}`);
    },
    fetchAdminProfileDetails: async () => {
        const response = await fetchUser();

        set({ adminProfileDetails: response.data, companyDetails: response.data.company });
        // Update invoice generator store
        useInvoiceEditStore.getState().setBillFrom(response?.data?.company?.name || response?.data?.name);
        useInvoiceEditStore.getState().setBillFromDetails(`${response?.data?.company?.address || response?.data?.address || ""}\n${response?.data?.company?.GSTIN ? "GSTIN No: " + response?.data?.company?.GSTIN : ""}`);
    },
    fetchCompanyDetails: async () => { },
    editProfileDetails: async (data) => {
        const { userId } = useUserStore.getState();
        const response = await updateUser(userId, data);
        set({ profileDetails: response.data, companyDetails: response.data.company });
        return response;
    },
    editCompanyDetails: async (data) => {
        const { userId } = useUserStore.getState();
        const response = await updateCompany(userId, data);
        set({ companyDetails: response.data });
        return response;
    },
    deleteProfileImage: async (data) => {
        const { userId } = useUserStore.getState();
        const response = await deleteProfile(userId, data);
        set({ profileDetails: response.data });
        return response;
    },
    replaceProfileImage: async (data) => {
        const { userId } = useUserStore.getState();
        const response = await replaceProfile(userId, data);
        set({
            profileDetails: {
                ...response.data,
                imageUrl: response.data.imageUrl   // Force refresh
            }
        });
        return response;
    },
    uploadProfileImage: async (data) => {
        const { userId } = useUserStore.getState();
        const response = await uploadProfile(userId, data);
        set({ profileDetails: response.data });
        return response;
    },
    deleteLogo: async (data) => {
        const response = await deleteLogo(data);
        set({ companyDetails: response.data });
        return response;
    },
    replaceLogo: async (data) => {
        const response = await replaceLogo(data);
        set({
            companyDetails: {
                ...response.data,
                imageUrl: response.data.imageUrl   // Force refresh
            }
        });
        return response;
    },
    uploadLogo: async (data) => {
        const response = await uploadLogo(data);
        set({ companyDetails: response.data });
        return response;
    },
    tab: "personal",
    setTab: (data: any) => set({ tab: data }),
    reset: () => {
        set({ profileDetails: undefined })
    }

}));

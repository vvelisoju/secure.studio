import { create, StateCreator } from "zustand";
import {
    fetchAllUsers, createUser, createEmployee,
    fetchAllUserSubscriptions, deleteEmployee, fetchUser,
    sendSubscriptionStatusToUser, sendSubscriptionStatusToUsers,
    deleteUser, deleteUsers
} from "../api/users";
import { updateAdminAllowed } from "../api/subscription";
import { persist, createJSONStorage } from 'zustand/middleware';
import debounce from "lodash.debounce";
import { convertToUTC2 } from "../utils/date";
interface User {
    id: string;
    serialNumber: any;
    name: string;
    email: string;
    password: string | null;
    imageUrl: string;
    phone: string;
    gender: string;
    dob: string;
    joiningDate: string;
    otp: string;
    otpToken: string;
    otpGeneratedAt: string;
    otpExpiresAt: string;
    userType: string;
    wallet: number;
    advance: number;
    userAdminId: string | null;
    createdAt: string;
    updatedAt: string;
    company: any;
    UserSubscriptions: any;
    status: string;
}

interface UserState {
    users: User[];
    employees: any[],
    userId: string,
    userRole: string,
    userName: string,
    user: any,
    subscriptionTab: string,
    setSubscriptionTab: (value: string) => void,
    documentTab: string; // New state for document tab
    setDocumentTab: (value: string) => void; // New setter for document tab
    page: number;
    totalPages: number;
    pageSize: number;
    loading: boolean;
    updateAdminAllowed: (id: string, value: string) => void;
    fetchUser: () => Promise<void>;
    fetchUsers: (page?: number, search?: string) => Promise<void>;
    search: string;
    setSearch: (value?: string) => void;
    clearSearch: (value?: string) => void;
    fetchEmployees: (page?: number) => Promise<void>;
    removeEmployee: (id?: string) => Promise<void>;
    createEmployee: (data: any) => Promise<void>;
    createUser: (data: any) => Promise<void>;
    sendSubscriptionStatusMail: (id: any) => Promise<void>;
    sendSubscriptionStatusMails: (ids: any) => Promise<void>;
    deleteUsers: (id: any) => Promise<void>;
    deleteUser: (ids: any) => Promise<void>;
    setPage: (page: number) => void;
    setSelectedUser: (user: User) => void;
    freeMeetingRoomSlots: number;
    setFreeMeetingRoomSlots: (value: number) => void,
    resetFreeMeetingRoomSlots: () => void;
    filters: any;
    setFilters: (value: any) => void;
    subscriptionStatus: any;
    setSubscriptionStatus: (value: any) => void;
    userStatus: any;
    setUserStatus: (value: any) => void;
    userTypes: any;
    setuserTypes: (value: any) => void;
    invoiceTypes: any;
    setInvoiceTypes: (value: any) => void;
    joiningFrom: any;
    setJoiningFrom: (value: any) => void;
    joiningTo: any;
    setJoiningTo: (value: any) => void;
    removeFilter: (value: any) => void;
    clearFilters: () => void;
    openFilters: boolean;
    setOpenFilters: (value: any) => void;
}

// Zustand Store
export const useUserStore = create<UserState>(
    persist((set, get) => ({
        users: [],
        employees: [],
        userId: "",
        userRole: "",
        userName: "userDetails",
        subscriptionTab: "SUBSCRIPTIONS",
        user: {},
        documentTab: "DOCUMENTS", // Default value for document tab
        setSubscriptionTab: (value) => set({ subscriptionTab: value }),
        setDocumentTab: (value) => set({ documentTab: value }), // Setter function
        page: 1,
        totalPages: 1,
        pageSize: 10,
        loading: false,
        freeMeetingRoomSlots: 0,
        search: "",
        setSearch: async (searchText) => {
            set({ loading: true, search: searchText });
            const { page, pageSize, filters, } = get();
            // Helper to extract values
            const getFilterValues = (type: any) =>
                filters.filter((f: any) => f.type === type).map((f: any) => f.value);
            let subscriptionStatus = getFilterValues("subscriptionStatus") || [];
            let bringTrailUsers = false;
            if (subscriptionStatus.includes("TRIAL")) {
                bringTrailUsers = true;
                subscriptionStatus = subscriptionStatus.filter((status: string) => status !== "TRIAL");
            }
            let userType = getFilterValues("userType") || [];
            let userStatus = getFilterValues("userStatus") || [];
            let invoiceType = getFilterValues("invoiceType") || [];
            const joiningFrom = filters.find((f: any) => f.type === "joiningFrom")?.value || null;
            const joiningTo = filters.find((f: any) => f.type === "joiningTo")?.value || null;
            // Debounced function declared once inside the store scope
            const debouncedFetch = debounce(async () => {
                const response = await fetchAllUsers(page, pageSize, searchText, userType, userStatus, subscriptionStatus, convertToUTC2(joiningFrom), convertToUTC2(joiningTo), invoiceType, bringTrailUsers, "USERS");
                set({
                    users: response.data.users,
                    totalPages: response.data.totalCount,
                    loading: false,
                    page
                });
            }, 1000); // 1000ms = 1 second
            debouncedFetch();
        },
        clearSearch: async () => {
            set({ loading: true, search: "" });
            const { page, pageSize, filters, } = get();
            // Helper to extract values
            const getFilterValues = (type: any) =>
                filters.filter((f: any) => f.type === type).map((f: any) => f.value);
            let subscriptionStatus = getFilterValues("subscriptionStatus") || [];
            let bringTrailUsers = false;
            if (subscriptionStatus.includes("TRIAL")) {
                bringTrailUsers = true;
                subscriptionStatus = subscriptionStatus.filter((status: string) => status !== "TRIAL");
            }
            let userType = getFilterValues("userType") || [];
            let userStatus = getFilterValues("userStatus") || [];
            let invoiceType = getFilterValues("invoiceType") || [];
            const joiningFrom = filters.find((f: any) => f.type === "joiningFrom")?.value || null;
            const joiningTo = filters.find((f: any) => f.type === "joiningTo")?.value || null;
            // Debounced function declared once inside the store scope
            const debouncedFetch = debounce(async () => {
                const response = await fetchAllUsers(page, pageSize, "", userType, userStatus, subscriptionStatus, convertToUTC2(joiningFrom), convertToUTC2(joiningTo), invoiceType, bringTrailUsers, "USERS");
                set({
                    users: response.data.users,
                    totalPages: response.data.totalCount,
                    loading: false,
                    page
                });
            }, 1000); // 1000ms = 1 second
            debouncedFetch();
        },
        setFreeMeetingRoomSlots: (value) => set({ freeMeetingRoomSlots: value }),
        resetFreeMeetingRoomSlots: () => {
            const { user } = get();
            set({ freeMeetingRoomSlots: user.freeMeetingRoomSlots })
        },
        fetchUser: async () => {
            const response = await fetchUser();
            set({ freeMeetingRoomSlots: response.data.freeMeetingRoomSlots, user: response.data });
        },
        fetchUsers: async (page = 1, section = "DASHBOARD") => {
            set({ loading: true });
            const { pageSize, filters, search } = get();
            // Helper to extract values
            const getFilterValues = (type: any) =>
                filters.filter((f: any) => f.type === type).map((f: any) => f.value);
            let subscriptionStatus = getFilterValues("subscriptionStatus") || [];
            let bringTrailUsers = false;
            if (subscriptionStatus.includes("TRIAL")) {
                bringTrailUsers = true;
                subscriptionStatus = subscriptionStatus.filter((status: string) => status !== "TRIAL");
            }
            if (section === "DASHBOARD") {
                subscriptionStatus = ["ACTIVE"]
            }
            let userType = getFilterValues("userType") || [];
            let userStatus = getFilterValues("userStatus") || [];
            let invoiceType = getFilterValues("invoiceType") || [];
            const joiningFrom = filters.find((f: any) => f.type === "joiningFrom")?.value || null;
            const joiningTo = filters.find((f: any) => f.type === "joiningTo")?.value || null;
            // Debounced function declared once inside the store scope
            const debouncedFetch = debounce(async () => {
                const response = await fetchAllUsers(page, pageSize, search, userType, userStatus, subscriptionStatus, convertToUTC2(joiningFrom), convertToUTC2(joiningTo), invoiceType, bringTrailUsers, section);
                set({
                    users: response.data.users,
                    totalPages: response.data.totalCount,
                    loading: false,
                    page
                });
            }, 1000); // 1000ms = 1 second
            debouncedFetch();
        },
        fetchEmployees: async (page = 1) => {
            set({ loading: true });
            const { pageSize } = get();
            const response = await fetchAllUserSubscriptions(page, pageSize);
            set({ employees: response.data.users, totalPages: response.data.totalCount, loading: false, page });
        },
        removeEmployee: async (id) => {
            const response = await deleteEmployee(id);
            return response;
        },
        createEmployee: async (data) => {
            const response = await createEmployee(data);
            return response;
        },
        createUser: async (data) => {
            const response = await createUser(data);
            return response;
        },
        sendSubscriptionStatusMail: async (id: any) => {
            const response = await sendSubscriptionStatusToUser(id);
            return response;
        },
        sendSubscriptionStatusMails: async (ids: any) => {
            const response = await sendSubscriptionStatusToUsers(ids);
            return response;
        },
        deleteUsers: async (ids: any) => {
            const response = await deleteUsers(ids);
            return response;
        },
        deleteUser: async (id: any) => {
            const response = await deleteUser(id);
            return response;
        },
        updateAdminAllowed: async (id, value) => {
            const response = await updateAdminAllowed(id, value);
            return response;
        },
        filters: [{ type: "userStatus", label: "User Active", value: "ACTIVE" }],
        setFilters: (filters) => {
            set({ filters, openFilters: false, loading: true });
            // Helper to extract values
            const { page, pageSize, search, } = get();
            // Helper to extract values
            const getFilterValues = (type: any) =>
                filters.filter((f: any) => f.type === type).map((f: any) => f.value);
            let subscriptionStatus = getFilterValues("subscriptionStatus") || [];
            let bringTrailUsers = false;
            if (subscriptionStatus.includes("TRIAL")) {
                bringTrailUsers = true;
                subscriptionStatus = subscriptionStatus.filter((status: string) => status !== "TRIAL");
            }
            let userType = getFilterValues("userType") || [];
            let userStatus = getFilterValues("userStatus") || [];
            let invoiceType = getFilterValues("invoiceType") || [];
            const joiningFrom = filters.find((f: any) => f.type === "joiningFrom")?.value || null;
            const joiningTo = filters.find((f: any) => f.type === "joiningTo")?.value || null;
            // Debounced function declared once inside the store scope
            const debouncedFetch = debounce(async () => {
                const response = await fetchAllUsers(page, pageSize, search, userType, userStatus, subscriptionStatus, convertToUTC2(joiningFrom), convertToUTC2(joiningTo), invoiceType, bringTrailUsers, "USERS");
                set({
                    users: response.data.users,
                    totalPages: response.data.totalCount,
                    loading: false,
                    page
                });
            }, 1000); // 1000ms = 1 second
            debouncedFetch();
        },
        subscriptionStatus: [],
        setSubscriptionStatus: (value) => set({ subscriptionStatus: value }),
        userStatus: ["ACTIVE"],
        setUserStatus: (value) => set({ userStatus: value }),
        userTypes: [],
        setuserTypes: (value) => set({ userTypes: value }),
        invoiceTypes: [],
        setInvoiceTypes: (value) => set({ invoiceTypes: value }),
        joiningFrom: '',
        setJoiningFrom: (value) => set({ joiningFrom: value }),
        joiningTo: '',
        setJoiningTo: (value) => set({ joiningTo: value }),
        clearFilters: () => {
            set({ subscriptionStatus: [], userTypes: [], userStatus: ["ACTIVE"], joiningFrom: "", joiningTo: "", filters: [{ type: "userStatus", label: "User Active", value: "ACTIVE" }], invoiceTypes: [], page: 1 })
        },
        removeFilter: (filterToRemove) => {
            const { userStatus, setUserStatus, subscriptionStatus, setInvoiceTypes, invoiceTypes, userTypes, setSubscriptionStatus, setuserTypes, setJoiningFrom, setJoiningTo, filters, setFilters } = get();
            if (!filterToRemove || !filterToRemove.type) return;
            if (filterToRemove.type === "subscriptionStatus") {
                setSubscriptionStatus(subscriptionStatus.filter((val: string) => val !== filterToRemove.value));
            } else if (filterToRemove.type === "userStatus") {
                setUserStatus(userStatus.filter((val: string) => val !== filterToRemove.value));
            } else if (filterToRemove.type === "userType") {
                setuserTypes(userTypes.filter((val: string) => val !== filterToRemove.value));
            } else if (filterToRemove.type === "invoiceType") {
                setInvoiceTypes(invoiceTypes.filter((val: string) => val !== filterToRemove.value));
            } else if (filterToRemove.type === "joiningFrom") {
                setJoiningFrom(null);
            } else if (filterToRemove.type === "joiningTo") {
                setJoiningTo(null);
            }
            // Remove from combined filters array
            const updatedFilters = filters.filter(
                (f: any) => !(f.type === filterToRemove.type && f.value === filterToRemove.value)
            );
            setFilters(updatedFilters);
        },
        openFilters: false,
        setOpenFilters: (value) => set({ openFilters: value }),
        setSelectedUser: (data) => set({ userId: data?.id || "", userRole: data?.userType, userName: data?.name || "" }),
        setPage: (page) => set({ page }),
    }),
        {
            name: 'user-store', // Key for localStorage
            storage: createJSONStorage(() => localStorage), // Use JSON serialization with localStorage
            partialize: (state) => (state.userId ? state : {}),
        }) as StateCreator<UserState>
);

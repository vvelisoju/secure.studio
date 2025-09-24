import { create } from "zustand";
import { fetchUserSubscriptions } from "../api/subscription";
import { useUserStore } from "./users";

interface SubscriptionState {
    subscriptionIds: string[];
    subscriptions: any;
    selectedSubscription: any;
    setSelectedSubscription: (data: any) => void;
    loading: boolean;
    fetchSubscriptions: (page?: number) => Promise<void>;
}

// Zustand Store
export const useSubscriptionsStore = create<SubscriptionState>((set) => ({
    subscriptionIds: [],
    subscriptions: [],
    selectedSubscription: {},
    setSelectedSubscription: (data) => {
        set({ selectedSubscription: data })
    },
    loading: false,
    fetchSubscriptions: async () => {
        set({ loading: true });
        const { userId } = useUserStore.getState();
        const response = await fetchUserSubscriptions(userId);
        const ids: any = []
        response.data.subscriptions.map((Subscription: any) => {
            if (Subscription.status !== "DELETED") {
                ids.push(Subscription?.service?.id)
            }
        });
        set({ subscriptions: response.data.subscriptions, loading: false, subscriptionIds: ids });
    },
}));

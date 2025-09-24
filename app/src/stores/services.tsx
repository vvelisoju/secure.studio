import { create } from "zustand";
import { getAllServiceCategories } from "../api/serviceCategory";
import { getcontinuedDurationDates, getDaysUntilEndOfMonthLocalMidnight, getDurationDates, getDurationDatesForExtend, getMaxEndTime } from "../utils/date";
import Services from "../pages/subscriptions";
import { useBookingSummaryStore } from "./bookingSummary";
import { useSubscriptionsStore } from "./subscription";
type Duration = "HOUR" | "DAY" | "MONTH" | "YEAR"


interface ServiceCategoryState {
    invoiceDate: any;
    setInvoiceDate: (value: any) => void;
    continutedDurations: Boolean;
    visiblePaymentCard: Boolean;
    bookingDetails: any;
    nextStep: any,
    planDetails: any,
    serviceCategories: any[];
    selectedServices: any[];
    allServices: any[],
    services: any[],
    servicesWithMeetingRoom: any[],
    selectedServiceCategory: any,
    selectedPlans: any[];
    selectedService: any;
    selectedPlan: any;
    scheduleCount: number;
    submitSchedule: any;
    durationDates: any,
    durations: any[];
    extendValidity: Boolean;
    isQuoted: Boolean;
    duration: any;
    setDuration: (value: Duration) => void;
    discount: any;
    setDiscount: (value: any) => void;
    discountByAdmin: any;
    setDiscountByAdmin: (value: any) => void;
    advanceByAdmin: any;
    setAdvanceByAdmin: (value: any) => void;
    recommendedCards: string[];
    startTimeError: boolean;
    bookingType: string;
    setBookingType: (value: string) => void;
    previousSubscription: any;
    setPreviousSubscription: (value: any) => void;
    serviceQuantity: number;
    setStartTimeError: (value: boolean) => void;
    setServiceQuantity: (value: number) => void;
    openBookingDrawer: boolean;
    invoiceDownload: any;
    setInvoiceDownload: (data: any) => void;
    setBookingDrawer: (value: boolean) => void;
    setPaymentCard: (value: boolean) => void;
    setDurationDates: (data: any) => void;
    setSubmitSchedule: (data: any) => void;
    setScheduleCount: (value: number) => void;
    getServiceCategories: () => Promise<void>;
    getServices: () => Promise<void>;
    setSelectedServiceCategory: (data: any) => void;
    setSelectedService: (data: any) => void;
    setSelectedPlan: (data: any, type?: any, newData?: any) => void;
    setNextStep: (data: any) => void;
    setBookingDetails: (data: any) => void;
    openSubscriptions: () => void;
    reset: () => void;
}

const useServiceStore = create<ServiceCategoryState>((set, get) => ({
    continutedDurations: false,
    visiblePaymentCard: false,
    bookingDetails: undefined,
    serviceQuantity: 1,
    bookingType: "NEW",
    setBookingType: (value) => set({ bookingType: value }),
    nextStep: {},
    durationDates: {},
    planDetails: {},
    serviceCategories: [],
    selectedServiceCategory: {},
    selectedServices: [],
    allServices: [],
    servicesWithMeetingRoom: [],
    services: [],
    durations: [],
    duration: "",
    selectedPlans: [],
    selectedService: {},
    selectedPlan: {},
    scheduleCount: 1,
    submitSchedule: undefined,
    recommendedCards: [],
    invoiceDate: "",
    extendValidity: false,
    isQuoted: false,
    previousSubscription: {},
    setPreviousSubscription: (value: any) => set({ previousSubscription: value }),
    discount: 0.00,
    setDiscount: (value) => set({ discount: value }),
    discountByAdmin: 0.00,
    setDiscountByAdmin: (value) => set({ discountByAdmin: value }),
    advanceByAdmin: 0.00,
    setAdvanceByAdmin: (value) => set({ advanceByAdmin: value }),
    setInvoiceDate: (value: any) => { set({ invoiceDate: value }) },
    startTimeError: false,
    setStartTimeError: (value) => set({ startTimeError: value }),
    invoiceDownload: {},
    setInvoiceDownload: (data) => set({ invoiceDownload: data }),
    setDuration: (value) => {
        const { services } = get();
        let matchedServices = [];
        const recommendedIds = [];
        for (const service of services) {
            const matchingPlan = service.plans.find((plan: any) => plan.name === value);
            if (matchingPlan) {
                matchedServices.push({ ...service, plan: matchingPlan });
                if (matchingPlan?.recommended) recommendedIds.push(service?.id);
            }
        }
        set({
            duration: value,
            selectedServices: matchedServices,
            recommendedCards: recommendedIds,
        });
    },
    setServiceQuantity: (value: number) => {
        const quantity = value <= 0 ? 1 : value;
        set({ serviceQuantity: quantity });
    },
    openBookingDrawer: false,
    setBookingDrawer: (value) => {
        const { reset } = useBookingSummaryStore.getState();
        if (value) {
            set({ openBookingDrawer: value })
        } else {
            reset();
            set({ openBookingDrawer: value, serviceQuantity: 1, discountByAdmin: 0, advanceByAdmin: 0, discount: 0 })
        }
    },
    setPaymentCard: (value) => set({ visiblePaymentCard: value }),
    setDurationDates: (data) => set({ durationDates: data }),
    setSubmitSchedule: (data) => set({ submitSchedule: data }),
    getServiceCategories: async () => {
        try {
            const response = await getAllServiceCategories();
            let matchedServices = [];
            let uniqueDurations = new Set<Duration>();

            for (const service of response.data[0].services) {
                for (const plan of service.plans) {
                    uniqueDurations.add(plan.name); // Collect unique durations
                }
            }
            const availableDurations = Array.from(uniqueDurations);
            const firstDuration = availableDurations[0];

            const recommendedIds = [];

            for (const service of response.data[0].services) {
                const matchingPlan = service.plans.find((plan: any) => plan.name === firstDuration);
                if (matchingPlan) {
                    matchedServices.push({ ...service, plan: matchingPlan });
                    if (matchingPlan?.recommended) recommendedIds.push(service?.id);
                }
            }
            set({
                serviceCategories: response.data,
                selectedServices: matchedServices,
                selectedServiceCategory: response.data[0],
                services: response.data[0].services,
                durations: availableDurations,
                duration: firstDuration,
                recommendedCards: recommendedIds,
            });
        } catch (error) {
            console.error("Failed to fetch service categories:", error);
        }
    },
    getServices: async () => {
        try {
            const response = await getAllServiceCategories();
            const services = [];
            const servicesWithMeetingRoom = [];
            for (const category of response.data) {
                for (const service of category.services) {
                    if (!service?.meetingRoomAccess) services.push(service);
                    if (service?.meetingRoomAccess) servicesWithMeetingRoom.push(service);
                }
            }
            set({ allServices: services, servicesWithMeetingRoom });
        } catch (error) {
            console.error("Failed to fetch services:", error);
        }
    },
    setSelectedServiceCategory: (data) => {
        let matchedServices = [];
        let uniqueDurations = new Set<Duration>();

        for (const service of data.services) {
            for (const plan of service.plans) {
                uniqueDurations.add(plan.name); // Collect unique durations
            }
        }
        const availableDurations = Array.from(uniqueDurations);
        const firstDuration = availableDurations[0];

        const recommendedIds = [];

        for (const service of data.services) {
            const matchingPlan = service.plans.find((plan: any) => plan.name === firstDuration);
            if (matchingPlan) {
                matchedServices.push({ ...service, plan: matchingPlan });
                if (matchingPlan?.recommended) recommendedIds.push(service?.id);
            }
        }
        set({
            selectedServiceCategory: data,
            services: data.services,
            selectedServices: matchedServices,
            durations: availableDurations,
            duration: firstDuration,
            recommendedCards: recommendedIds,
        });
    },
    setSelectedService: (data) => {
        set({ selectedService: data, selectedPlan: data.plans[0] });
    },
    openSubscriptions: () => {

    },
    setSelectedPlan: (data, type, subscription) => {
        let durationDates;
        if (type === "NEW") {
            durationDates = getDurationDates(data?.duration, data?.defaultValue);
            console.log(durationDates, "dates")
            const { setPrice } = useBookingSummaryStore.getState();
            setPrice(data?.price * data?.defaultValue);
            set({ bookingType: type, selectedPlan: data, durationDates, continutedDurations: false, scheduleCount: data?.defaultValue, extendValidity: false, isQuoted: false });
        } else if (["INACTIVE", "ACTIVE"].includes(type) && subscription?.id) {
            durationDates = getDurationDatesForExtend(data?.duration, data?.defaultValue, subscription?.endTime);
            const { setPrice } = useBookingSummaryStore.getState();
            setPrice(subscription?.amount);
            set({ discountByAdmin: subscription?.discount, discount: subscription?.discount, previousSubscription: subscription, bookingType: type, selectedPlan: data, durationDates, continutedDurations: false, scheduleCount: data?.defaultValue, extendValidity: true, isQuoted: false });
        } else if (["QUOTED"].includes(type)) {
            durationDates = { startTime: subscription?.booking?.startTime, endTime: subscription?.booking?.endTime };
            const { setPrice } = useBookingSummaryStore.getState();
            setPrice(subscription?.amount);
            set({
                bookingType: type,
                serviceQuantity: subscription?.employeesAllowed, discountByAdmin: subscription?.discount,
                discount: subscription?.discount, selectedPlan: data, durationDates, continutedDurations: false,
                scheduleCount: data?.defaultValue, extendValidity: false, isQuoted: true
            });
        }
    },
    setScheduleCount: (value: number) => {
        set({ scheduleCount: value })
    },
    setNextStep: (data: any) => set({ nextStep: data }),
    setBookingDetails: (data: any) => set({ bookingDetails: data }),
    reset: () => {
        set({
            nextStep: {},
            planDetails: {},
            selectedServiceCategory: {},
            selectedService: {},
            selectedPlan: {},
        })
    }
}));

export default useServiceStore;

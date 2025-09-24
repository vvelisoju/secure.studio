import axiosInstance from './axiosConfig';

interface Credentials {
    planId: string;
    coupon?: string;
    scheduleCount?: number;
}

export const createOrder: any = async (id: string, credentials: Credentials): Promise<void> => {
    try {
        const url = id ? `/payment/create-order?id=${id}` : `/payment/create-order`;
        const response = await axiosInstance.post(url, credentials);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const createOrderForMeetingRooms: any = async (id: string, credentials: Credentials): Promise<void> => {
    try {
        const url = id ? `/payment/meeting-room/create-order?id=${id}` : `/payment/meeting-room/create-order`;
        const response = await axiosInstance.post(url, credentials);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const cancelOrder: any = async (bookingId: string): Promise<void> => {
    try {
        const response = await axiosInstance.post('/payment/cancel-order', { bookingId });
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const paymentFail: any = async (bookingId: string): Promise<void> => {
    try {
        const response = await axiosInstance.post('/payment/payment-failed', { bookingId });
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const payOffline: any = async (id: string, credentials: Credentials): Promise<void> => {
    try {
        const url = id ? `/payment/offline?id=${id}` : `/payment/offline`;
        const response = await axiosInstance.post(url, credentials);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
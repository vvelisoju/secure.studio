import axiosInstance from './axiosConfig';

export const fetchUserSubscriptions: any = async (id: string): Promise<void> => {
    try {
        const url = id ? `/userSubscription?id=${id}` : `/userSubscription`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const updateAdminAllowed: any = async (id: string, value: string): Promise<void> => {
    try {
        const url = `/subscription/adminAllowed`;
        const response = await axiosInstance.put(url, { value, id });
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const deleteSubscription: any = async (id: string): Promise<void> => {
    try {
        const url = `/subscription?id=${id}`;
        const response = await axiosInstance.delete(url);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};


export const updateSubscription: any = async (data: any): Promise<void> => {
    try {
        const url = `/subscription`;
        const response = await axiosInstance.put(url, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const updateQuotedSubscription: any = async (data: any): Promise<void> => {
    try {
        const url = `/subscription/activate`;
        const response = await axiosInstance.put(url, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
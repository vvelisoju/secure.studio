import axiosInstance from './axiosConfig';

export const getInvoiceSetting: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/invoiceSetting`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const updateInvoiceSetting: any = async (data: any): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/invoiceSetting`, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
import axiosInstance from './axiosConfig';

export const fetchInvoices: any = async (id: string, page: number, pageSize: number): Promise<void> => {
    try {
        const url = id ? `/invoice/user?page=${page}&limit=${pageSize}&id=${id}` : `/invoice/user?page=${page}&limit=${pageSize}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const fetchInvoice: any = async (id: string,): Promise<void> => {
    try {
        const url = `/invoice?id=${id}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const updateInvoice: any = async (data: any): Promise<void> => {
    try {
        const url = `/invoice/user`
        const response = await axiosInstance.put(url ,data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const createDirectInvoice: any = async (data: any): Promise<void> => {
    try {
        const url = `/invoice/direct`
        const response = await axiosInstance.post(url, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
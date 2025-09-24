import axiosInstance from './axiosConfig';

export const getAdvancesListOfUser: any = async (userId: string): Promise<void> => {
    try {

        const response = await axiosInstance.get(`/advanceHistory?userId=${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const updateData: any = async (data: any): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/advanceHistory`, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const addData: any = async (data: any): Promise<void> => {
    try {
        const response = await axiosInstance.post(`/advanceHistory`, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
import axiosInstance from './axiosConfig';

export const getAppSetting: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/appSetting`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const updateAppSetting: any = async (data: any): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/appSetting`, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
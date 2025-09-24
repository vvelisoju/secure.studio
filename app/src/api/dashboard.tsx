import axiosInstance from './axiosConfig';

export const getDashboardDetails: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/dashboard`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const getAdminDashboardDetails: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/dashboard/admin`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
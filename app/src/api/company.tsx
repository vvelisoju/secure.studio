import axiosInstance from './axiosConfig';

export const getCompanyDetails: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/company/admin`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
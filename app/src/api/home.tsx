import axiosInstance from './axiosConfig';

export const fetchAmenities: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/home/amenities`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const fetchServicesCategories: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/home/services`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};


export const getInTouch: any = async (data: any): Promise<void> => {
    try {
        const response = await axiosInstance.post(`/support/getInTouch`, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
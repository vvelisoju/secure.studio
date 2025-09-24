import axiosInstance from './axiosConfig';


export const updateNotificationSchedule: any = async (data: any): Promise<void> => {
    try {
        const response = await axiosInstance.put('/notificationSchedule', data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const getNotificationSchedule: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get('/notificationSchedule');
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
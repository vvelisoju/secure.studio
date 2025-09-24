import axiosInstance from './axiosConfig';


export const getSchedulableNotificationTemplates: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get('/notificationTemplate/schedulable');
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
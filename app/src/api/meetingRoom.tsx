import axiosInstance from './axiosConfig';


export const updateMeetingRoomSetting: any = async (data: any, pass409: boolean = false): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/meetingRoomSetting/admin?pass409=${pass409}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const getMeetingRoomSetting: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get('/meetingRoomSetting/admin');
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};
import axiosInstance from './axiosConfig';

export const fetchBookedTimeSlotOfUser: any = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/timeslot/booked`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const fetchTimeSlots: any = async (dates: any): Promise<void> => {
    try {
        const response = await axiosInstance.get(`/timeslot?startTime=${dates.startTime}&endTime=${dates.endTime}`);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

export const bookTimeSlots: any = async (slotIds: any): Promise<void> => {
    try {
        const response = await axiosInstance.put(`/timeslot/book`, slotIds);
        return response.data;
    } catch (error: any) {
        throw error.response
    }
};

import axiosInstance from "./axiosConfig";

export const fetchUserDocuments = async (id: string): Promise<any> => {
    try {
        const url = id ? `/document/user?id=${id}` : `/document/user`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: any) {
        throw error.response;
    }
};
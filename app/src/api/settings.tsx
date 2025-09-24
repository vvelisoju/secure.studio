import axiosInstance from './axiosConfig';

export const fetchUser: any = async (id: string): Promise<void> => {
  try {
    const url = id ? `/user?id=${id}` : `/user`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const updateUser: any = async (id: string, data: any): Promise<void> => {
  try {
    const url = id ? `/user?id=${id}` : `/user`;
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};


export const deleteProfile: any = async (id: string, data: any): Promise<void> => {
  try {
    const url = id ? `/user/delete-profile?id=${id}` : `/user/delete-profile`;
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const uploadProfile: any = async (id: string, data: any): Promise<void> => {
  try {
    const url = id ? `/user/upload-profile?id=${id}` : `/user/upload-profile`;
    const response = await axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const replaceProfile: any = async (id: string, data: any): Promise<void> => {
  try {
    const url = id ? `/user/replace-profile?id=${id}` : `/user/replace-profile`;
    const response = await axiosInstance.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};



export const updateCompany: any = async (id: string, data: any): Promise<void> => {
  try {
    const url = id ? `/company?id=${id}` : `/company`;
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const uploadLogo: any = async (data: any): Promise<void> => {
  try {
    const url = `/company/upload-logo`;
    const response = await axiosInstance.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const replaceLogo: any = async (data: any): Promise<void> => {
  try {
    const url = `/company/replace-logo`;
    const response = await axiosInstance.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const deleteLogo: any = async (data: any): Promise<void> => {
  try {
    const url = `/company/delete-logo`;
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};
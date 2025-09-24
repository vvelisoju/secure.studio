import axiosInstance from './axiosConfig';

export const fetchAllUsers: any = async (page: number, pageSize: number, search?: string, userType?: any, userStatus?: any, subscriptionStatus?: any, joiningFrom?: string, joiningTo?: string, invoiceType?: any, bringTrailUsers?: any, section?: any): Promise<void> => {
  try {
    const response = await axiosInstance.get(`/user/all?page=${page}&limit=${pageSize}&search=${search}&userType=${userType ? userType.length > 0 ? userType : "" : ''}&invoiceType=${invoiceType ? invoiceType.length > 0 ? invoiceType : "" : ''}&userStatus=${userStatus ? userStatus.length > 0 ? userStatus : "" : ""}&subscriptionStatus=${subscriptionStatus ? subscriptionStatus.length > 0 ? subscriptionStatus : "" : ""}&joiningFrom=${joiningFrom !== null && joiningFrom !== undefined ? joiningFrom : ''}&joiningTo=${joiningTo !== null && joiningTo !== undefined ? joiningTo : ""}&bringTrailUsers=${bringTrailUsers}&section=${section}`);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};


export const createUser: any = async (data: any): Promise<void> => {
  try {
    const response = await axiosInstance.post(`/user`, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const fetchUser: any = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get(`/user`,);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const createEmployee: any = async (data: any): Promise<void> => {
  try {
    const response = await axiosInstance.post(`/user/employee`, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const updateUserStatus: any = async (data: any): Promise<void> => {
  try {
    const url = `/user/status`;
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const fetchAllUserSubscriptions: any = async (page: number, pageSize: number): Promise<void> => {
  try {
    const response = await axiosInstance.get(`/userSubscription/all/assignedBy?page=${page}&limit=${pageSize}`);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const deleteEmployee: any = async (userId: string, SubId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/user/employee?id=${userId}&subscriptionId=${SubId}`);
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const sendSubscriptionStatusToUsers: any = async (ids: string[]): Promise<void> => {
  try {
    const url = `/user/subscription-status-multiple`;
    const response = await axiosInstance.post(url, { ids });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const sendSubscriptionStatusToUser: any = async (id: string): Promise<void> => {
  try {
    const url = `/user/subscription-status-single`;
    const response = await axiosInstance.post(url, { id });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const deleteUsers: any = async (ids: string[]): Promise<void> => {
  try {
    const url = `/user/delete-users`;
    const response = await axiosInstance.put(url, { ids });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

export const deleteUser: any = async (id: string): Promise<void> => {
  try {
    const url = `/user/delete-user`;
    const response = await axiosInstance.put(url, { id });
    return response.data;
  } catch (error: any) {
    throw error.response
  }
};

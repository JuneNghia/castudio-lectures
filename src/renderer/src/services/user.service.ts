import axiosConfig from "@renderer/utils/axios";

const USER = {
  GET_LIST: "/user",
  GET_BY_ID: (id: string) => `/user/${id}`,
  ADD_SUPPORT: `/user/add-support`,
  UPDATE_BY_ID: (id: string) => `/user/${id}`,
  DELETE_BY_ID: (id: string) => `/user/${id}`,
};

export const fetchedUsers = async (params: any) => {
  const res = await axiosConfig.get(USER.GET_LIST, { params: params });
  return res.data.data;
};

export const fetchedUserById = async (id: string) => {
  const res = await axiosConfig.get(USER.GET_BY_ID(id));
  return res.data.data;
};

export const updatedUserById = async (id: string, data: any) => {
  const res = await axiosConfig.patch(USER.UPDATE_BY_ID(id), data);
  return res.data.data;
};

export const createdSupport = async (data: any) => {
  const res = await axiosConfig.post(USER.ADD_SUPPORT, data);
  return res.data.data;
};

export const deletedUserById = async (id: string) => {
  const res = await axiosConfig.delete(USER.DELETE_BY_ID(id));
  return res.data.data;
};

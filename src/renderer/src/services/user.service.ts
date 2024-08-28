import axiosConfig from "@renderer/utils/axios";

const USER = {
  GET_LIST: "/user",
};

export const fetchedUsers = async (params: any) => {
  const res = await axiosConfig.get(USER.GET_LIST, { params: params });
  return res.data.data;
};

import axiosConfig from "@renderer/utils/axios";

export const WHITELIST = {
  GET_LIST: `/white-list`,
  UPDATE_BY_CLASS: (classId: string) => `/white-list/${classId}`,
};

export const fetchedWhiteList = async (params: any) => {
  const res = await axiosConfig.get(WHITELIST.GET_LIST, { params });
  return res.data.data;
};

export const updatedWLByClass = async (classId: string, data: any) => {
  const res = await axiosConfig.put(WHITELIST.UPDATE_BY_CLASS(classId), data);
  return res.data.data;
};

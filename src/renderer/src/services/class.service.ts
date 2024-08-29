import axiosConfig from "@renderer/utils/axios";

const CLASS = {
  GET_LIST: `/class`,
  UPDADTE_ALL: `/class`,
};

export const fetchedClasses = async () => {
  const res = await axiosConfig.get(CLASS.GET_LIST);
  return res.data.data;
};

export const updatedClasses = async (data: any) => {
  const res = await axiosConfig.put(CLASS.UPDADTE_ALL, data);
  return res.data.data;
};

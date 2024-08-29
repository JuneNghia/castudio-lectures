import axiosConfig from "@renderer/utils/axios";

const VIDEO = {
  GET_LIST: `/video`,
  UPDATE_ALL_VIDEO_BY_CLASS: (classId: string) => `/video/${classId}`,
};

export const fetchedVideos = async (params?: any) => {
  const res = await axiosConfig.get(VIDEO.GET_LIST, { params });
  return res.data.data;
};

export const updatedVideosByClass = async (classId: string, data: any) => {
  const res = await axiosConfig.put(
    VIDEO.UPDATE_ALL_VIDEO_BY_CLASS(classId),
    data
  );
  return res.data.data;
};

import axiosConfig from "@renderer/utils/axios";

const FILE = {
  GET_LIST: `/file`,
  DELETE_BY_FILENAME: (fileName: string) => `/file/${fileName}`,
  UPLOAD: `/file/upload`,
};

export const fetchedFiles = async () => {
  const res = await axiosConfig.get(FILE.GET_LIST);
  return res.data.data;
};

export const uploadedFile = async (data) => {
  const res = await axiosConfig.post(FILE.UPLOAD, data);
  return res.data.data;
};

export const deletedFileByFileName = async (fileName: string) => {
  const res = await axiosConfig.delete(FILE.DELETE_BY_FILENAME(fileName));
  return res.data.data;
};

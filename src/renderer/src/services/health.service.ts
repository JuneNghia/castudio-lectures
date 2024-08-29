import axiosConfig from "@renderer/utils/axios";

const HEALTH = {
  CHECK: `/health`,
};

export const checkHealth = async () => {
  const res = await axiosConfig.get(HEALTH.CHECK);
  return res.data.data;
};

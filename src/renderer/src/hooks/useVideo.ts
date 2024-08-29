import {
  fetchedVideos,
  updatedVideosByClass,
} from "@renderer/services/video.service";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Params {
  classId: string | undefined;
}

export const useVideo = (params: Params) => {
  const queryKey = ["video", params.classId];

  const {
    data: listVideos,
    isPending,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => fetchedVideos(params),
  });

  const { mutateAsync: updateVideosByClass, isPending: isUpdating } =
    useMutation({
      mutationFn: ({ classId, data }: { classId: string; data: any }) =>
        updatedVideosByClass(classId, data),
      
    });

  return {
    updateVideosByClass,
    listVideos,
    isPending,
    isUpdating,
    isError,
  };
};

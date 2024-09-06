import { QuerySearch } from "@renderer/common/interface/search.interface";
import {
  deletedById,
  fetchedWhiteList,
  updatedWLByClass,
} from "@renderer/services/whitelist.service";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Params extends QuerySearch {
  classId: string | undefined;
}

export const useWhiteList = (params: Params) => {
  const queryKey = [
    "user",
    params.page,
    params.search,
    params.size,
    params.isActive,
    params.classId,
  ];

  const {
    data: whiteList,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchedWhiteList(params),
  });

  const { mutateAsync: updateWLByClass } = useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: any }) =>
      updatedWLByClass(classId, data),
  });

  const { mutateAsync: deleteById } = useMutation({
    mutationFn: ({ id }: { id: string }) => deletedById(id),
  });

  return {
    whiteList,
    isPending,
    isError,
    refetch,
    updateWLByClass,
    deleteById
  };
};

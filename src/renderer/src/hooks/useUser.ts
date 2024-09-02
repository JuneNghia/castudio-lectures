import { QuerySearch } from "@renderer/common/interface/search.interface";
import {
  createdSupport,
  deletedUserById,
  fetchedUserById,
  fetchedUsers,
  updatedUserById,
} from "@renderer/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Params extends QuerySearch {
  classId: string | undefined;
}

export const useUser = (params: Params) => {
  const queryKey = [
    "user",
    params.page,
    params.search,
    params.size,
    params.isActive,
    params.classId,
  ];

  const {
    data: listUsers,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchedUsers(params),
  });

  const { mutateAsync: fetchUserById } = useMutation({
    mutationFn: ({ id }: { id: string }) => fetchedUserById(id),
  });

  const { mutateAsync: updateUserById } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatedUserById(id, data),
  });

  const { mutateAsync: createSupport } = useMutation({
    mutationFn: ({ data }: { data: any }) => createdSupport(data),
  });

  const { mutateAsync: deleteUserById } = useMutation({
    mutationFn: ({ id }: { id: string }) => deletedUserById(id),
  });

  return {
    listUsers,
    fetchUserById,
    updateUserById,
    deleteUserById,
    isPending,
    isError,
    refetch,
    createSupport,
  };
};

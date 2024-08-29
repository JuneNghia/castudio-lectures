import { QuerySearch } from "@renderer/common/interface/search.interface";
import { fetchedUsers } from "@renderer/services/user.service";
import { useQuery } from "@tanstack/react-query";

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
    params.classId
  ];

  const {
    data: listUsers,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchedUsers(params),
  });

  return {
    listUsers,
    isPending,
    isError,
  };
};

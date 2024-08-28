import { QuerySearch } from "@renderer/common/interface/search.interface";
import { fetchedUsers } from "@renderer/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useUser = (params: QuerySearch) => {
  const queryKey = [
    "user",
    params.page,
    params.search,
    params.size,
    params.isActive,
  ];

  const { data: listUsers, isPending } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchedUsers(params),
  });

  return {
    listUsers,
    isPending,
  };
};

import {
  fetchedClasses,
  updatedClasses,
} from "@renderer/services/class.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useClass = () => {
  const queryKey = ["class"];
  const queryClient = useQueryClient();

  const { data: listClasses, isPending, isError } = useQuery({
    queryKey,
    queryFn: fetchedClasses,
  });

  const { mutateAsync: updateClasses, isPending: isUpdating } = useMutation({
    mutationFn: ({ data }: { data: any }) => updatedClasses(data),
    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: queryKey,
      }),
  });

  return {
    listClasses,
    isPending,
    updateClasses,
    isUpdating,
    isError
  };
};

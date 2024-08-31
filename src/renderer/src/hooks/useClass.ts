import {
  fetchedClasses,
  updatedClasses,
} from "@renderer/services/class.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useClass = () => {
  const queryKey = ["class"];

  const {
    data: listClasses,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchedClasses,
  });

  const { mutateAsync: updateClasses, isPending: isUpdating } = useMutation({
    mutationFn: ({ data }: { data: any }) => updatedClasses(data),
  });

  return {
    listClasses,
    isPending,
    updateClasses,
    isUpdating,
    isError,
    refetch,
  };
};

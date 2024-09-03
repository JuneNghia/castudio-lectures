import {
  deletedFileByFileName,
  fetchedFiles,
  uploadedFile,
} from "@renderer/services/file.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFile = () => {
  const queryKey = ["file"];
  const {
    data: dataFileAPI,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchedFiles,
  });

  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: ({ data }: { data: any }) => uploadedFile(data),
  });

  const { mutateAsync: deleteFileByFileName } = useMutation({
    mutationFn: ({ fileName }: { fileName: string }) =>
      deletedFileByFileName(fileName),
  });
  return {
    dataFileAPI,
    isPending,
    uploadFile,
    deleteFileByFileName,
    refetch,
    isError
  };
};

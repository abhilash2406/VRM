import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData, deleteData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const galleryKeys = {
  all: ['gallery'],
};

export const useGallery = () => {
  return useQuery({
    queryKey: galleryKeys.all,
    queryFn: async () => {
      const { data } = await getData('/gallery');
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};

export const useUploadToGallery = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (image) => {
      const { data } = await postData('/gallery', image);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useDeleteFromGallery = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/gallery/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData, deleteData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const profileKeys = {
  all: ['profile'],
  details: () => [...profileKeys.all, 'details'],
  feedbacks: () => [...profileKeys.all, 'feedbacks'],
  feedback: (id) => [...profileKeys.all, 'feedback', id],
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.details(),
    queryFn: async () => {
      const { data } = await getData('/profile/view');
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};

export const useFeedbacks = () => {
  return useQuery({
    queryKey: profileKeys.feedbacks(),
    queryFn: async () => {
      const { data } = await getData('/profile/feedback');
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};

export const useFeedback = (id) => {
  return useQuery({
    queryKey: profileKeys.feedback(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getData(`/profile/feedback/${id}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/profile/feedback/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: profileKeys.feedbacks() });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useChangePassword = () => {
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/profile/change-password', props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

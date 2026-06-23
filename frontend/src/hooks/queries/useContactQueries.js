import { useMutation } from '@tanstack/react-query';
import { postData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const useSubmitContact = () => {
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (input) => {
      const { data } = await postData('/contact', input);
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

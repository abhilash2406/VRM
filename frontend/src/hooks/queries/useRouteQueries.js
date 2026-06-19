import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData, deleteData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const routeKeys = {
  all: ['routes'],
  details: (id) => [...routeKeys.all, 'details', id],
};

export const useAllRoutes = () => {
  return useQuery({
    queryKey: routeKeys.all,
    queryFn: async () => {
      const { data } = await getData('/routes');
      return data.data;
    },
  });
};

export const useRouteDetails = (id) => {
  return useQuery({
    queryKey: routeKeys.details(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getData(`/routes/${id}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useAddRoute = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (routeData) => {
      const { data } = await postData('/routes/add', routeData);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage('Route created Successfully');
      queryClient.invalidateQueries({ queryKey: routeKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/routes/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: routeKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

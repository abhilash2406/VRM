import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData, deleteData, updateData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const tripKeys = {
  all: ['trips'],
  count: () => [...tripKeys.all, 'count'],
  details: (id) => [...tripKeys.all, 'details', id],
};

export const useAllTrips = () => {
  return useQuery({
    queryKey: tripKeys.all,
    queryFn: async () => {
      const { data } = await getData('/trips');
      return data.data;
    },
  });
};

export const useTripsCount = () => {
  return useQuery({
    queryKey: tripKeys.count(),
    queryFn: async () => {
      const { data } = await postData('/trips/count');
      return data.data;
    },
  });
};

export const useTripDetails = (id) => {
  return useQuery({
    queryKey: tripKeys.details(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getData(`/trips/${id}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useAddTrip = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (tripData) => {
      const { data } = await postData('/trips', tripData);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
      queryClient.invalidateQueries({ queryKey: tripKeys.count() });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, props }) => {
      const { data } = await updateData(`/trips/${id}`, props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
      queryClient.invalidateQueries({ queryKey: tripKeys.details(variables.id) });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/trips/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
      queryClient.invalidateQueries({ queryKey: tripKeys.count() });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

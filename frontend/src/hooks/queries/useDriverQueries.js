import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData, updateData, deleteData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const driverKeys = {
  all: ['drivers'],
  active: () => [...driverKeys.all, 'active'],
  details: (id) => [...driverKeys.all, 'details', id],
};

export const useAllDrivers = () => {
  return useQuery({
    queryKey: driverKeys.all,
    queryFn: async () => {
      const { data } = await getData('/drivers');
      return data.data;
    },
  });
};

export const useActiveDrivers = () => {
  return useQuery({
    queryKey: driverKeys.active(),
    queryFn: async () => {
      const { data } = await getData('/drivers/present');
      return data.data; // Note: Original action didn't dispatch, just logged. This returns it.
    },
  });
};

export const useDriverDetails = (id) => {
  return useQuery({
    queryKey: driverKeys.details(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getData(`/drivers/${id}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useAddDriver = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/drivers', props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, props }) => {
      const { data } = await updateData(`/drivers/${id}`, props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
      queryClient.invalidateQueries({ queryKey: driverKeys.details(variables.id) });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/drivers/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useRejectDriver = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await updateData(`/drivers/reject/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, id) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: driverKeys.details(id) });
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useApproveDriverWages = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, props }) => {
      const { data } = await updateData(`/drivers/approve/${id}`, props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: driverKeys.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

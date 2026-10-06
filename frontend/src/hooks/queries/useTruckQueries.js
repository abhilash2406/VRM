import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData, updateData, deleteData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';

export const truckKeys = {
  all: ['trucks'],
  brands: () => [...truckKeys.all, 'brands'],
  models: () => [...truckKeys.all, 'models'],
  variants: () => [...truckKeys.all, 'variants'],
  details: (id) => [...truckKeys.all, 'details', id],
  active: () => [...truckKeys.all, 'active'],
};

export const useTruckBrands = () => {
  return useQuery({
    queryKey: truckKeys.brands(),
    queryFn: async () => {
      const { data } = await getData('/trucks/brands');
      return data.data;
    },
  });
};

export const useTruckModels = () => {
  return useQuery({
    queryKey: truckKeys.models(),
    queryFn: async () => {
      const { data } = await getData('/trucks/models');
      return data.data;
    },
  });
};

export const useTruckVariants = () => {
  return useQuery({
    queryKey: truckKeys.variants(),
    queryFn: async () => {
      const { data } = await getData('/trucks/variants');
      return data.data;
    },
  });
};

export const useAllTrucks = (params = {}) => {
  return useQuery({
    queryKey: [...truckKeys.all, params],
    queryFn: async () => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/vehicles?${queryString}` : '/vehicles';
      
      const { data } = await getData(endpoint);
      if (!data.success) throw new Error(data.message);
      return data;
    },
  });
};

export const useTruckDetails = (id) => {
  return useQuery({
    queryKey: truckKeys.details(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getData(`/vehicles/${id}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useActiveTrucks = () => {
  return useQuery({
    queryKey: truckKeys.active(),
    queryFn: async () => {
      const { data } = await getData('/trucks/activeTrucks');
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};

// Returns models and variants based on brand
export const useCorrespondingTruckData = () => {
  return useMutation({
    mutationFn: async (dat) => {
      const { data } = await postData('/trucks/get-data', dat);
      return data; // returns { model, variant }
    },
  });
};

export const useAddTruck = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('vehicles/add', props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.success);
      queryClient.invalidateQueries({ queryKey: truckKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useUpdateTruck = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, props }) => {
      const { data } = await updateData(`/vehicles/${id}`, props);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: truckKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useUpdateTruckAvailability = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, availability_status }) => {
      const { data } = await updateData(`/vehicles/${id}/availability`, { availability_status });
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: truckKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useUpdateTruckStatus = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await updateData(`/vehicles/${id}/status`, { status });
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: truckKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/vehicles/${id}`);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: truckKeys.all });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

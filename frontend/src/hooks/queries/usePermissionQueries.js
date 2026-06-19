import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';
import { useAuthStore } from '../../store/useAuthStore';

export const permissionKeys = {
  all: ['permissions'],
  rolePermissions: (id) => [...permissionKeys.all, 'role', id],
};

export const useAllPermissions = () => {
  return useQuery({
    queryKey: permissionKeys.all,
    queryFn: async () => {
      const { data } = await getData('/permissions');
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};

export const useRolePermissions = (id) => {
  return useQuery({
    queryKey: permissionKeys.rolePermissions(id),
    queryFn: async () => {
      if (!id) return null;
      const { data } = await getData(`/permissions/permission/${id}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useGivePermission = () => {
  const queryClient = useQueryClient();
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async ({ id, updateData }) => {
      const { data } = await postData(`/permissions/${id}`, updateData);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data, variables) => {
      setSuccessMessage(data.message);
      queryClient.invalidateQueries({ queryKey: permissionKeys.rolePermissions(variables.id) });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

// Instead of dispatching GET_LOGIN, we can fetch permissions and update Zustand store
export const useLoginPermissions = () => {
  const setLogin = useAuthStore((state) => state.setLogin);

  return useMutation({
    mutationFn: async () => {
      const { data } = await postData('/profile/permissions');
      return data.data;
    },
    onSuccess: (data) => {
      setLogin(data.designation, data.permission);
    },
  });
};

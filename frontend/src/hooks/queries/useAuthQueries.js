import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { postData, getData } from '../../services';
import { useMsgStore } from '../../store/useMsgStore';
import { useAuthStore } from '../../store/useAuthStore';
import Cookies from 'js-cookie';

export const useLogin = () => {
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);
  const setLoginStore = useAuthStore((state) => state.setLogin);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/auth/login', props);
      if (!data.success) throw new Error(data.message || 'Login failed');
      return data.data;
    },
    onSuccess: (data) => {
      Cookies.set('token', data.accessToken);
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          token: data.accessToken,
          designation: data.designation,
          name: data.user,
        })
      );
      setLoginStore(data.designation, data.permission);
      setSuccessMessage('Login successful');
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useGoogleLogin = () => {
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);
  const setLoginStore = useAuthStore((state) => state.setLogin);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/auth/GLogin', props);
      if (!data.success) throw new Error(data.message || 'Login failed');
      return data.data;
    },
    onSuccess: (data) => {
      Cookies.set('token', data.accessToken);
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          token: data.accessToken,
          designation: data.designation,
          name: data.user,
        })
      );
      setLoginStore(data.designation, data.permission);
      setSuccessMessage('Login successful');
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useSignup = () => {
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);
  const setUsermailStore = useAuthStore((state) => state.setUsermail);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/auth/signUp', props);
      if (!data.success) throw new Error(data.message || 'Signup failed');
      return data.data;
    },
    onSuccess: (data) => {
      setUsermailStore(data);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useGoogleSignup = () => {
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);
  const setUsermailStore = useAuthStore((state) => state.setUsermail);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/auth/GsignUp', props);
      if (!data.success) throw new Error(data.message || 'Signup failed');
      return data.data;
    },
    onSuccess: (data) => {
      setUsermailStore(data);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useUserData = () => {
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);
  const setUserDataStore = useAuthStore((state) => state.setUserData);

  return useMutation({
    mutationFn: async (props) => {
      const { data } = await postData('/auth/userdata', props);
      if (!data.success) throw new Error(data.message || 'Failed to submit data');
      return data;
    },
    onSuccess: (data) => {
      const jsonString = JSON.stringify(data.data);
      Cookies.set('myCookie', jsonString);
      setUserDataStore(data.data);
      window.location.href = data.url;
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useMakePayment = () => {
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await postData('/auth/payment', userData);
      if (!data.success) throw new Error(data.message || 'Payment failed');
      return data;
    },
    onSuccess: (data) => {
      window.location.href = data.next_action.use_stripe_sdk.stripe_js;
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useAddUser = () => {
  const setSuccessMessage = useMsgStore((state) => state.setSuccessMessage);
  const setErrorMessage = useMsgStore((state) => state.setErrorMessage);

  return useMutation({
    mutationFn: async (data) => {
      const res = await postData('/auth/add-user', data);
      if (!res.data.success) throw new Error(res.data.message || 'Failed to add user');
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data.message);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });
};

export const useDesignations = () => {
  return useQuery({
    queryKey: ['designations'],
    queryFn: async () => {
      const { data } = await getData('/designations');
      return data.data;
    },
  });
};

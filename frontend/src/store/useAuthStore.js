import { create } from 'zustand';
import Cookies from 'js-cookie';

export const useAuthStore = create((set) => ({
  isLogin: Cookies.get('token') ? Cookies.get('token') : null,
  setLoading: null,
  grantedPermissions: [],
  role: '',
  usermail: '',
  userdata: {},
  driverData: [], // Depending on usage, this might be better in React Query

  setLogin: (payload, permission) => set({
    isLogin: Cookies.get('token'),
    role: payload,
    grantedPermissions: permission,
  }),

  setLogout: (payload = null) => set({
    isLogin: payload,
    role: '',
    grantedPermissions: [],
    userdata: {},
  }),

  setLoadingStatus: (payload) => set({ setLoading: payload }),
  setUsermail: (payload) => set({ usermail: payload }),
  setUserData: (payload) => set({ userdata: payload }),
  setDriverDetails: (payload) => set({ driverData: payload }),
}));

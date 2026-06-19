import { create } from 'zustand';

export const useMsgStore = create((set) => ({
  successMsg: '',
  errorMsg: '',

  setSuccessMessage: (payload) => set({ successMsg: payload }),
  setErrorMessage: (payload) => set({ errorMsg: payload }),
  resetSuccessMessage: () => set({ successMsg: null }),
  resetErrorMessage: () => set({ errorMsg: null }),
}));

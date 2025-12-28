import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  landmark: string;
}

interface CustomerState {
  info: CustomerInfo;
  updateInfo: (info: Partial<CustomerInfo>) => void;
  clearInfo: () => void;
}

const defaultInfo: CustomerInfo = {
  name: '',
  phone: '',
  address: '',
  landmark: '',
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      info: defaultInfo,

      updateInfo: (newInfo) => {
        set((state) => ({
          info: { ...state.info, ...newInfo },
        }));
      },

      clearInfo: () => set({ info: defaultInfo }),
    }),
    {
      name: 'tum-panich-customer',
    }
  )
);

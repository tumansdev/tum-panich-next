// API client for Tum Panich LIFF App
import { MenuItem, Category, Order, CreateOrderRequest, Announcement } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

// Fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Menu API
export const menuAPI = {
  getAll: () => fetchAPI<MenuItem[]>('/api/menu'),
  getById: (id: string) => fetchAPI<MenuItem>(`/api/menu/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => fetchAPI<Category[]>('/api/categories'),
};

// Orders API
export const ordersAPI = {
  create: (order: CreateOrderRequest) =>
    fetchAPI<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  
  getById: (id: string) => fetchAPI<Order>(`/api/orders/${id}`),
  
  getByUser: (lineUserId: string) =>
    fetchAPI<Order[]>(`/api/orders/user/${lineUserId}`),
  
  uploadSlip: async (orderId: string, file: File): Promise<Order> => {
    const formData = new FormData();
    formData.append('slip', file);

    const response = await fetch(`${API_URL}/api/orders/${orderId}/slip`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload slip');
    }

    return response.json();
  },
};

// Announcements API
export const announcementsAPI = {
  getAll: () => fetchAPI<Announcement[]>('/api/announcements'),
  getToday: () => fetchAPI<Announcement>('/api/announcements/today'),
};

// Store Status API
export interface StoreStatusResponse {
  isOpen: boolean;
  message: string;
  closeTime: string | null;
  closeTimeStr: string | null;
  minutesUntilClose: number | null;
  isSunday: boolean;
  hours: {
    weekday: { open: string; close: string };
    sunday: string;
  };
}

export interface SpecialMenuResponse {
  active: boolean;
  title: string;
  description: string;
  emoji: string;
}

export const storeAPI = {
  getStatus: () => fetchAPI<StoreStatusResponse>('/api/store/status'),
  getSpecialMenu: () => fetchAPI<SpecialMenuResponse>('/api/store/special-menu'),
};

export default {
  menu: menuAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  announcements: announcementsAPI,
  store: storeAPI,
};

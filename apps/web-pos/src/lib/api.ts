// API client for Tum Panich Admin Panel
import { getAuthToken } from '../stores/authStore';
import { Order, MenuItem, Category, OrderStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

// API response types (snake_case from backend)
interface APIOrder {
  id: string;
  items: string | object[];
  total_amount: string | number;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  delivery_type: string;
  delivery_address?: string;
  landmark?: string;
  payment_method: 'cash' | 'promptpay';
  payment_status: 'pending' | 'paid' | 'confirmed';
  slip_image_url?: string;
  line_user_id?: string;
  created_at: string;
  updated_at: string;
}

interface APIMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  available: boolean;
  is_special?: boolean;
}

interface APICategory {
  id: string;
  name: string;
  icon?: string;
  sort_order?: number;
}

interface APIAnnouncement {
  id: number;
  day_of_week: number;
  menu_name: string;
  emoji?: string;
  active: boolean;
}

// Utility function to map API order to frontend format
export function mapOrderFromAPI(o: APIOrder): Order {
  return {
    id: o.id,
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    totalAmount: typeof o.total_amount === 'string' ? parseFloat(o.total_amount) : o.total_amount,
    status: o.status,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    deliveryType: o.delivery_type as Order['deliveryType'],
    deliveryAddress: o.delivery_address,
    landmark: o.landmark,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    slipImage: o.slip_image_url,
    lineUserId: o.line_user_id,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

// Fetch wrapper with error handling, JWT auth, and auto-refresh
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
  retryOnUnauth = true
): Promise<T> {
  const token = getAuthToken();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  // Handle 401 - try to refresh token once
  if (response.status === 401 && retryOnUnauth && token) {
    console.log('🔄 Token expired, attempting refresh...');
    
    // Import dynamically to avoid circular dependency
    const { useAuthStore } = await import('../stores/authStore');
    const refreshed = await useAuthStore.getState().refreshToken();
    
    if (refreshed) {
      // Retry the original request with new token
      return fetchAPI<T>(endpoint, options, false);
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Session หมดอายุ กรุณา Login ใหม่');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Menu API (Admin)
export const menuAPI = {
  getAll: () => fetchAPI<APIMenuItem[]>('/api/menu'),
  
  getById: (id: string) => fetchAPI<APIMenuItem>(`/api/menu/${id}`),
  
  create: (item: Partial<MenuItem>) =>
    fetchAPI<APIMenuItem>('/api/menu', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  update: (id: string, data: Partial<MenuItem>) =>
    fetchAPI<APIMenuItem>(`/api/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/api/menu/${id}`, {
      method: 'DELETE',
    }),
  
  toggle: (id: string) =>
    fetchAPI<APIMenuItem>(`/api/menu/${id}/toggle`, {
      method: 'PUT',
    }),
  
  uploadImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/menu/${id}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json() as Promise<{ url: string }>;
  },
};

// Categories API (Admin)
export const categoriesAPI = {
  getAll: () => fetchAPI<APICategory[]>('/api/categories'),
  
  create: (category: Partial<Category>) =>
    fetchAPI<APICategory>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  
  update: (id: string, data: Partial<Category>) =>
    fetchAPI<APICategory>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Orders API (Admin)
export const ordersAPI = {
  getAll: (params?: { status?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    return fetchAPI<APIOrder[]>(`/api/orders?${query.toString()}`);
  },
  
  getById: (id: string) => fetchAPI<APIOrder>(`/api/orders/${id}`),
  
  getHistory: (id: string) => fetchAPI<{ status: string; changed_at: string }[]>(`/api/orders/${id}/history`),
  
  updateStatus: (id: string, status: OrderStatus) =>
    fetchAPI<APIOrder>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Announcements API (Admin)
export const announcementsAPI = {
  getAll: () => fetchAPI<APIAnnouncement[]>('/api/announcements'),
  
  update: (announcements: Partial<APIAnnouncement>[]) =>
    fetchAPI<APIAnnouncement[]>('/api/announcements', {
      method: 'PUT',
      body: JSON.stringify({ announcements }),
    }),
  
  updateDay: (dayOfWeek: number, data: Partial<APIAnnouncement>) =>
    fetchAPI<APIAnnouncement>(`/api/announcements/${dayOfWeek}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export default {
  menu: menuAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  announcements: announcementsAPI,
};

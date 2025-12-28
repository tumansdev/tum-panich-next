// API client for Tum Panich LIFF App
const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

interface APIResponse<T> {
  data?: T;
  error?: string;
}

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
  getAll: () => fetchAPI<any[]>('/api/menu'),
  getById: (id: string) => fetchAPI<any>(`/api/menu/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => fetchAPI<any[]>('/api/categories'),
};

// Orders API
export const ordersAPI = {
  create: (order: any) =>
    fetchAPI<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  
  getById: (id: string) => fetchAPI<any>(`/api/orders/${id}`),
  
  getByUser: (lineUserId: string) =>
    fetchAPI<any[]>(`/api/orders/user/${lineUserId}`),
  
  uploadSlip: async (orderId: string, file: File) => {
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
  getAll: () => fetchAPI<any[]>('/api/announcements'),
  getToday: () => fetchAPI<any>('/api/announcements/today'),
};

export default {
  menu: menuAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  announcements: announcementsAPI,
};

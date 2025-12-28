// API client for Tum Panich Admin Panel
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

// Menu API (Admin)
export const menuAPI = {
  getAll: () => fetchAPI<any[]>('/api/menu'),
  
  getById: (id: string) => fetchAPI<any>(`/api/menu/${id}`),
  
  create: (item: any) =>
    fetchAPI<any>('/api/menu', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  update: (id: string, data: any) =>
    fetchAPI<any>(`/api/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchAPI<any>(`/api/menu/${id}`, {
      method: 'DELETE',
    }),
  
  toggle: (id: string) =>
    fetchAPI<any>(`/api/menu/${id}/toggle`, {
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

    return response.json();
  },
};

// Categories API (Admin)
export const categoriesAPI = {
  getAll: () => fetchAPI<any[]>('/api/categories'),
  
  create: (category: any) =>
    fetchAPI<any>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  
  update: (id: string, data: any) =>
    fetchAPI<any>(`/api/categories/${id}`, {
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
    return fetchAPI<any[]>(`/api/orders?${query.toString()}`);
  },
  
  getById: (id: string) => fetchAPI<any>(`/api/orders/${id}`),
  
  getHistory: (id: string) => fetchAPI<any[]>(`/api/orders/${id}/history`),
  
  updateStatus: (id: string, status: string) =>
    fetchAPI<any>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Announcements API (Admin)
export const announcementsAPI = {
  getAll: () => fetchAPI<any[]>('/api/announcements'),
  
  update: (announcements: any[]) =>
    fetchAPI<any[]>('/api/announcements', {
      method: 'PUT',
      body: JSON.stringify({ announcements }),
    }),
  
  updateDay: (dayOfWeek: number, data: any) =>
    fetchAPI<any>(`/api/announcements/${dayOfWeek}`, {
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

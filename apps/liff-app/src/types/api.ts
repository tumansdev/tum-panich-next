// API Types for Tum Panich LIFF App
// These mirror the backend database schema

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  category_name?: string;
  category_icon?: string;
  options?: string; // JSON string from DB
  available: boolean;
  is_special?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  sort_order?: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  note?: string;
  options?: Record<string, string>;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  line_user_id?: string;
  delivery_type: DeliveryType;
  delivery_address?: string;
  landmark?: string;
  distance_km?: number;
  payment_method: 'cash' | 'promptpay';
  payment_status: 'pending' | 'paid' | 'confirmed';
  slip_image_url?: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'cooking'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type DeliveryType = 'pickup' | 'free-delivery' | 'easy-delivery';

export interface CreateOrderRequest {
  items: OrderItem[];
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  delivery_address?: string;
  landmark?: string;
  distance_km?: number;
  payment_method: 'cash' | 'promptpay';
  line_user_id?: string;
}

export interface Announcement {
  id: number;
  day_of_week: number;
  menu_name: string;
  emoji?: string;
  active: boolean;
}

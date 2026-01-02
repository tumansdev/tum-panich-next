// ============================================================
// Tum Panich Shared Types - API Format (snake_case)
// ============================================================
// These types mirror the backend database/API responses
// Use mapFromAPI() functions to convert to frontend format
// ============================================================

import type { 
  OrderStatus, 
  DeliveryType, 
  PaymentMethod, 
  PaymentStatus,
  Order,
  OrderItem,
  MenuItem,
  Category,
  Announcement 
} from './index';

// Re-export common types
export type { OrderStatus, DeliveryType, PaymentMethod, PaymentStatus };

// ========== API Response Types (snake_case) ==========

export interface APIOrderItem {
  productId: string;
  productName: string;
  price: number;
  note?: string;
  options?: Record<string, string>;
}

export interface APIOrder {
  id: string;
  items: string | APIOrderItem[];  // May be JSON string from DB
  total_amount: string | number;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  line_user_id?: string;
  delivery_type: DeliveryType;
  delivery_address?: string;
  landmark?: string;
  distance_km?: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  slip_image_url?: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface APIMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  category_name?: string;
  category_icon?: string;
  options?: string;  // JSON string from DB
  available: boolean;
  is_special?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface APICategory {
  id: string;
  name: string;
  icon?: string;
  sort_order?: number;
}

export interface APIAnnouncement {
  id: number;
  day_of_week: number;
  menu_name: string;
  emoji?: string;
  active: boolean;
}

// ========== API Request Types ==========

export interface CreateOrderRequest {
  items: APIOrderItem[];
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  delivery_address?: string;
  landmark?: string;
  distance_km?: number;
  payment_method: PaymentMethod;
  line_user_id?: string;
  note?: string;
}

// ========== Mapping Functions ==========

/**
 * Map API Order (snake_case) to Frontend Order (camelCase)
 */
export function mapOrderFromAPI(apiOrder: APIOrder): Order {
  return {
    id: apiOrder.id,
    items: typeof apiOrder.items === 'string' 
      ? JSON.parse(apiOrder.items) 
      : apiOrder.items,
    totalAmount: parseFloat(String(apiOrder.total_amount)),
    status: apiOrder.status,
    customerName: apiOrder.customer_name,
    customerPhone: apiOrder.customer_phone,
    lineUserId: apiOrder.line_user_id,
    deliveryType: apiOrder.delivery_type,
    deliveryAddress: apiOrder.delivery_address,
    landmark: apiOrder.landmark,
    distanceKm: apiOrder.distance_km,
    paymentMethod: apiOrder.payment_method,
    paymentStatus: apiOrder.payment_status,
    slipImageUrl: apiOrder.slip_image_url,
    note: apiOrder.note,
    createdAt: apiOrder.created_at,
    updatedAt: apiOrder.updated_at,
  };
}

/**
 * Map API MenuItem (snake_case) to Frontend MenuItem (camelCase)
 */
export function mapMenuItemFromAPI(apiItem: APIMenuItem): MenuItem {
  return {
    id: apiItem.id,
    name: apiItem.name,
    description: apiItem.description,
    price: apiItem.price,
    imageUrl: apiItem.image_url,
    categoryId: apiItem.category_id,
    categoryName: apiItem.category_name,
    categoryIcon: apiItem.category_icon,
    options: apiItem.options ? JSON.parse(apiItem.options) : undefined,
    available: apiItem.available,
    isSpecial: apiItem.is_special,
    sortOrder: apiItem.sort_order,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
  };
}

/**
 * Map API Category (snake_case) to Frontend Category (camelCase)
 */
export function mapCategoryFromAPI(apiCategory: APICategory): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    icon: apiCategory.icon,
    sortOrder: apiCategory.sort_order,
  };
}

/**
 * Map API Announcement (snake_case) to Frontend Announcement (camelCase)
 */
export function mapAnnouncementFromAPI(apiAnnouncement: APIAnnouncement): Announcement {
  return {
    id: apiAnnouncement.id,
    dayOfWeek: apiAnnouncement.day_of_week,
    menuName: apiAnnouncement.menu_name,
    emoji: apiAnnouncement.emoji,
    active: apiAnnouncement.active,
  };
}

/**
 * Map multiple items from API format
 */
export function mapOrdersFromAPI(apiOrders: APIOrder[]): Order[] {
  return apiOrders.map(mapOrderFromAPI);
}

export function mapMenuItemsFromAPI(apiItems: APIMenuItem[]): MenuItem[] {
  return apiItems.map(mapMenuItemFromAPI);
}

export function mapCategoriesFromAPI(apiCategories: APICategory[]): Category[] {
  return apiCategories.map(mapCategoryFromAPI);
}

export function mapAnnouncementsFromAPI(apiAnnouncements: APIAnnouncement[]): Announcement[] {
  return apiAnnouncements.map(mapAnnouncementFromAPI);
}

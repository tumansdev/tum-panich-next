// ============================================================
// Tum Panich Shared Types - Frontend Format (camelCase)
// ============================================================
// These types are used in POS and LIFF frontends
// Use mapFromAPI() to convert snake_case API responses to these types
// ============================================================

// ========== Order Types ==========

export type OrderStatus = 
  | 'pending'      // รอยืนยัน
  | 'confirmed'    // ยืนยันแล้ว
  | 'cooking'      // กำลังทำ
  | 'ready'        // พร้อมส่ง/รับ
  | 'delivered'    // ส่งแล้ว
  | 'completed'    // เสร็จสิ้น
  | 'cancelled';   // ยกเลิก

export type DeliveryType = 'pickup' | 'free-delivery' | 'easy-delivery';

export type PaymentMethod = 'cash' | 'promptpay';

export type PaymentStatus = 'pending' | 'paid' | 'confirmed';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  note?: string;
  options?: Record<string, string>;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  lineUserId?: string;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  landmark?: string;
  distanceKm?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  slipImageUrl?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ========== Menu Types ==========

export interface ProductOption {
  id: string;
  name: string;
  choices: string[];
  required: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  categoryName?: string;
  categoryIcon?: string;
  options?: ProductOption[];
  available: boolean;
  isSpecial?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  sortOrder?: number;
}

// ========== Cart Types (LIFF Only) ==========

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  options?: ProductOption[];
  available: boolean;
  isSpecial?: boolean;
}

export interface CartItem {
  id: string;           // unique ID per item (uuid)
  product: Product;
  note: string;         // per-item note e.g. "no vegetables"
  selectedOptions?: Record<string, string>;
}

// ========== User Types ==========

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// ========== Announcement Types ==========

export interface Announcement {
  id: number;
  dayOfWeek: number;
  menuName: string;
  emoji?: string;
  active: boolean;
}

// ========== Store Types ==========

export interface StoreStatus {
  isOpen: boolean;
  message: string;
}

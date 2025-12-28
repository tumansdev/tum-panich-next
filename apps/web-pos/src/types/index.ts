// Order Types for Admin Panel

export type OrderStatus = 
  | 'pending'      // รอยืนยัน
  | 'confirmed'    // ยืนยันแล้ว
  | 'cooking'      // กำลังทำ
  | 'ready'        // พร้อมส่ง/รับ
  | 'delivered'    // ส่งแล้ว
  | 'completed'    // เสร็จสิ้น
  | 'cancelled';   // ยกเลิก

export type DeliveryType = 'pickup' | 'free-delivery' | 'easy-delivery';

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
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  landmark?: string;
  paymentMethod: 'cash' | 'promptpay';
  paymentStatus: 'pending' | 'paid' | 'confirmed';
  slipImage?: string;
  lineUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;       // Changed from image
  image_url?: string;      // API response format
  categoryId: string;      // Changed from category
  category_id?: string;    // API response format
  available: boolean;
  isSpecial?: boolean;
  is_special?: boolean;    // API response format
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

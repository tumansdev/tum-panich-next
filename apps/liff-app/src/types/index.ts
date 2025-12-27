// Types for Tum Panich LIFF App

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  options?: ProductOption[];
  available: boolean;
  isSpecial?: boolean; // เมนูพิเศษ
}

export interface ProductOption {
  id: string;
  name: string;
  choices: string[];
  required: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  paymentMethod: 'cash' | 'promptpay';
  paymentStatus: 'pending' | 'paid' | 'confirmed';
  slipImage?: string;
  lineUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'      // รอยืนยัน
  | 'confirmed'    // ยืนยันแล้ว
  | 'cooking'      // กำลังทำ
  | 'ready'        // พร้อมส่ง/รับ
  | 'delivered'    // ส่งแล้ว
  | 'completed'    // เสร็จสิ้น
  | 'cancelled';   // ยกเลิก

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

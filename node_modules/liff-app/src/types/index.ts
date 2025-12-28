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

// Cart Item แบบใหม่ - แยกเป็นรายการแต่ละจาน
export interface CartItem {
  id: string;           // unique ID ต่อรายการ (uuid)
  product: Product;
  note: string;         // โน้ตต่อจาน เช่น "ไม่ใส่ผัก"
  selectedOptions?: Record<string, string>;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'free-delivery' | 'easy-delivery';
  deliveryAddress?: string;
  landmark?: string;     // จุดสังเกต
  distanceKm?: number;   // ระยะทางจากร้าน
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

export type DeliveryType = 'pickup' | 'free-delivery' | 'easy-delivery';

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

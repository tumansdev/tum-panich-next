// ============================================================
// Tum Panich Shared Configuration
// ============================================================
// Centralized configuration for both POS and LIFF apps
// Single source of truth - no more scattered hardcoded values
// ============================================================

// ========== Store Information ==========

export const STORE_INFO = {
  name: 'ตั้มพานิช',
  slogan: '紅紅火火 • หมูแดงนุ่ม น้ำซุปหอม',
  hours: 'จันทร์ - เสาร์ 10:00 - 14:00 น.',
  phone: '084-115-8342',
  lineOaId: '@299xkppt',
  lineOaUrl: 'https://line.me/R/ti/p/@299xkppt',
  mapUrl: 'https://maps.app.goo.gl/Gs4BZZ9BJDAA44LH9',
  location: {
    lat: 14.584142066784167,
    lng: 100.42882812383826,
  },
} as const;

// ========== App Configuration ==========

export const APP_CONFIG = {
  version: '1.0.0',
  name: 'ตั้มพานิช',
  primaryColor: '#a40b0b',
  cartExpiryHours: 24,        // Clear cart after X hours of inactivity
  orderRefreshMs: 30000,      // Auto-refresh orders every 30 seconds
  socketReconnectAttempts: 5, // Max socket reconnection attempts
  socketReconnectDelay: 1000, // Delay between reconnect attempts (ms)
} as const;

// ========== Payment Configuration ==========

export const PAYMENT_CONFIG = {
  promptpay: {
    accountNumber: '0841158342',
    accountName: 'ตั้มพานิช',
    qrCodeUrl: '/images/promptpay-qr.png', // Relative path for app assets
  },
  deliveryFees: {
    pickup: 0,
    freeDelivery: 0,
    easyDelivery: {
      baseKm: 3,
      baseFee: 20,
      perKmFee: 10,
    },
  },
} as const;

// ========== Delivery Configuration ==========

export const DELIVERY_CONFIG = {
  freeDeliveryRadius: 3, // km
  maxDeliveryRadius: 10, // km
  minOrderForFreeDelivery: 100, // THB
} as const;

// ========== Error Messages (Thai) ==========

export const ERROR_MESSAGES = {
  network: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต',
  orderLoad: 'ไม่สามารถโหลดข้อมูลออเดอร์ได้ กรุณาลองใหม่',
  orderCreate: 'ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่',
  uploadSlip: 'ไม่สามารถอัพโหลดสลิปได้ กรุณาลองใหม่',
  menuLoad: 'ไม่สามารถโหลดเมนูได้ กรุณาลองใหม่',
  loginFailed: 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล',
  unauthorized: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบใหม่',
  unknown: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
} as const;

// ========== Order Status Labels (Thai) ==========

export const ORDER_STATUS_LABELS = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  cooking: 'กำลังทำ',
  ready: 'พร้อมส่ง/รับ',
  delivered: 'ส่งแล้ว',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
} as const;

export const ORDER_STATUS_COLORS = {
  pending: 'amber',
  confirmed: 'blue',
  cooking: 'orange',
  ready: 'green',
  delivered: 'emerald',
  completed: 'slate',
  cancelled: 'red',
} as const;

// ========== Delivery Type Labels (Thai) ==========

export const DELIVERY_TYPE_LABELS = {
  pickup: 'รับที่ร้าน',
  'free-delivery': 'จัดส่งฟรี',
  'easy-delivery': 'Easy Delivery',
} as const;

// ========== Payment Method Labels (Thai) ==========

export const PAYMENT_METHOD_LABELS = {
  cash: 'เงินสด',
  promptpay: 'พร้อมเพย์',
} as const;

export const PAYMENT_STATUS_LABELS = {
  pending: 'รอชำระ',
  paid: 'ชำระแล้ว',
  confirmed: 'ยืนยันแล้ว',
} as const;

// ========== Safe localStorage Wrapper ==========

export const storage = {
  get: <T = string>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.warn(`localStorage.get('${key}') failed:`, error);
      return defaultValue;
    }
  },
  
  set: (key: string, value: unknown): boolean => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`localStorage.set('${key}') failed:`, error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`localStorage.remove('${key}') failed:`, error);
      return false;
    }
  },
};

// ========== Helper Functions ==========

/**
 * Calculate delivery fee based on distance
 */
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= DELIVERY_CONFIG.freeDeliveryRadius) {
    return 0;
  }
  
  const extraKm = distanceKm - PAYMENT_CONFIG.deliveryFees.easyDelivery.baseKm;
  if (extraKm <= 0) {
    return PAYMENT_CONFIG.deliveryFees.easyDelivery.baseFee;
  }
  
  return PAYMENT_CONFIG.deliveryFees.easyDelivery.baseFee + 
         (extraKm * PAYMENT_CONFIG.deliveryFees.easyDelivery.perKmFee);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format currency (Thai Baht)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(amount);
}

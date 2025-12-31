// Shared store configuration for Tum Panich LIFF App
// Centralized constants to avoid hardcoded values throughout the codebase

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

export const APP_CONFIG = {
  version: '1.0.0',
  name: 'ตั้มพานิช LIFF App',
  primaryColor: '#a40b0b',
  cartExpiryHours: 24, // Clear cart after X hours of inactivity
} as const;

// Safe localStorage wrapper with error handling
export const storage = {
  get: <T = string>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      // Try to parse JSON, fallback to raw value
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

// User-friendly error messages
export const ERROR_MESSAGES = {
  network: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต',
  orderLoad: 'ไม่สามารถโหลดข้อมูลออเดอร์ได้ กรุณาลองใหม่',
  orderCreate: 'ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่',
  uploadSlip: 'ไม่สามารถอัพโหลดสลิปได้ กรุณาลองใหม่',
  menuLoad: 'ไม่สามารถโหลดเมนูได้ กรุณาลองใหม่',
  unknown: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
} as const;

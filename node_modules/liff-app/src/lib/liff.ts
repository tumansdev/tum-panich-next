import liff from '@line/liff';
import { LiffProfile } from '../types';

const LIFF_ID = import.meta.env.VITE_LIFF_ID || '';

let isInitialized = false;

export async function initializeLiff(): Promise<boolean> {
  if (isInitialized) return true;
  
  if (!LIFF_ID) {
    console.warn('LIFF_ID not set, running in browser mode');
    return false;
  }

  try {
    await liff.init({ liffId: LIFF_ID });
    isInitialized = true;
    console.log('LIFF initialized successfully');
    return true;
  } catch (error) {
    console.error('LIFF init failed:', error);
    return false;
  }
}

export function isInLiff(): boolean {
  return liff.isInClient();
}

export function isLoggedIn(): boolean {
  return liff.isLoggedIn();
}

export function login(): void {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
}

export function logout(): void {
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
}

export async function getProfile(): Promise<LiffProfile | null> {
  if (!liff.isLoggedIn()) return null;
  
  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}

export function getAccessToken(): string | null {
  return liff.getAccessToken();
}

// ส่งข้อความไปยังห้องแชท (ใช้ได้เฉพาะใน LINE)
export async function sendMessage(text: string): Promise<boolean> {
  if (!liff.isInClient()) {
    console.warn('sendMessage only works in LIFF browser');
    return false;
  }

  try {
    await liff.sendMessages([{ type: 'text', text }]);
    return true;
  } catch (error) {
    console.error('Failed to send message:', error);
    return false;
  }
}

// แชร์ข้อความไปยังเพื่อน/กลุ่ม
export async function shareMessage(text: string): Promise<boolean> {
  if (!liff.isApiAvailable('shareTargetPicker')) {
    console.warn('shareTargetPicker not available');
    return false;
  }

  try {
    await liff.shareTargetPicker([{ type: 'text', text }]);
    return true;
  } catch (error) {
    console.error('Failed to share message:', error);
    return false;
  }
}

// ปิด LIFF window
export function closeLiff(): void {
  if (liff.isInClient()) {
    liff.closeWindow();
  }
}

// Scan QR Code
export async function scanQRCode(): Promise<string | null> {
  if (!liff.isApiAvailable('scanCodeV2')) {
    console.warn('scanCodeV2 not available');
    return null;
  }

  try {
    const result = await liff.scanCodeV2();
    return result.value || null;
  } catch (error) {
    console.error('Failed to scan QR:', error);
    return null;
  }
}

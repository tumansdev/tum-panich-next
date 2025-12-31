import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { APP_CONFIG } from '../config/storeInfo';

// สร้าง unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface CartState {
  items: CartItem[];
  lastUpdated: number; // Timestamp for expiry check
  addItem: (product: Product, options?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateItemNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getGroupedItems: () => { product: Product; items: CartItem[] }[];
  checkAndClearExpired: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdated: Date.now(),

      // เพิ่มสินค้า 1 ชิ้น = 1 CartItem (ไม่รวม quantity)
      addItem: (product, options = {}) => {
        const newItem: CartItem = {
          id: generateId(),
          product,
          note: '',
          selectedOptions: options,
        };
        
        set((state) => ({
          items: [...state.items, newItem],
          lastUpdated: Date.now(),
        }));
      },

      // ลบรายการตาม itemId
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          lastUpdated: Date.now(),
        }));
      },

      // อัพเดท note ของรายการนั้นๆ
      updateItemNote: (itemId, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, note } : item
          ),
          lastUpdated: Date.now(),
        }));
      },

      clearCart: () => set({ items: [], lastUpdated: Date.now() }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.product.price, 0);
      },

      getItemCount: () => {
        return get().items.length;
      },

      // จัดกลุ่มสินค้าตาม product.id สำหรับแสดงผล
      getGroupedItems: () => {
        const items = get().items;
        const grouped = new Map<string, { product: Product; items: CartItem[] }>();

        items.forEach((item) => {
          const key = item.product.id + JSON.stringify(item.selectedOptions || {});
          
          if (grouped.has(key)) {
            grouped.get(key)!.items.push(item);
          } else {
            grouped.set(key, {
              product: item.product,
              items: [item],
            });
          }
        });

        return Array.from(grouped.values());
      },

      // Check and clear expired cart (Future-proofing)
      checkAndClearExpired: () => {
        const state = get();
        const hoursElapsed = (Date.now() - state.lastUpdated) / (1000 * 60 * 60);
        
        if (hoursElapsed >= APP_CONFIG.cartExpiryHours && state.items.length > 0) {
          console.log(`🛒 Cart expired after ${hoursElapsed.toFixed(1)} hours. Clearing...`);
          set({ items: [], lastUpdated: Date.now() });
        }
      },
    }),
    {
      name: 'tum-panich-cart-v3', // Bumped version for migration
      storage: createJSONStorage(() => {
        // Safe localStorage wrapper with error handling
        return {
          getItem: (name) => {
            try {
              return localStorage.getItem(name);
            } catch {
              console.warn('localStorage.getItem failed');
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              localStorage.setItem(name, value);
            } catch {
              console.warn('localStorage.setItem failed');
            }
          },
          removeItem: (name) => {
            try {
              localStorage.removeItem(name);
            } catch {
              console.warn('localStorage.removeItem failed');
            }
          },
        };
      }),
      // Only persist these fields
      partialize: (state) => ({ 
        items: state.items, 
        lastUpdated: state.lastUpdated 
      }),
    }
  )
);

// Auto-check for expired cart on module load
if (typeof window !== 'undefined') {
  // Delay check to ensure store is hydrated
  setTimeout(() => {
    useCartStore.getState().checkAndClearExpired();
  }, 1000);
}

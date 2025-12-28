import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

// สร้าง unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, options?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateItemNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getGroupedItems: () => { product: Product; items: CartItem[] }[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

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
        }));
      },

      // ลบรายการตาม itemId
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      // อัพเดท note ของรายการนั้นๆ
      updateItemNote: (itemId, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, note } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

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
    }),
    {
      name: 'tum-panich-cart-v2',
    }
  )
);

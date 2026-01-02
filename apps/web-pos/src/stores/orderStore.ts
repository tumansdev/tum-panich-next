import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { Order, OrderStatus } from '../types';
import { ordersAPI, mapOrderFromAPI } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  soundEnabled: boolean;
  isPlaying: boolean;
  loading: boolean;
  socket: Socket | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  selectOrder: (order: Order | null) => void;
  toggleSound: () => void;
  stopSound: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// Create notification audio element
let notificationAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  notificationAudio = new Audio('/admin/sounds/notification.mp3');
  notificationAudio.loop = true;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      selectedOrder: null,
      soundEnabled: true, // เสียงเปิดเป็นค่าเริ่มต้น
      isPlaying: false,
      loading: false,
      socket: null,

      setOrders: (orders) => set({ orders }),
      
      fetchOrders: async () => {
        set({ loading: true });
        try {
          const orders = await ordersAPI.getAll();
          // Use shared mapping function
          const mappedOrders = orders.map(mapOrderFromAPI);
          set({ orders: mappedOrders, loading: false });
        } catch (error) {
          console.error('Failed to fetch orders:', error);
          set({ loading: false });
        }
      },
      
      addOrder: (order) => {
        const state = get();
        // เล่นเสียงเฉพาะเมื่อเปิดเสียงไว้
        if (state.soundEnabled && notificationAudio) {
          notificationAudio.play().catch(() => {
            // Silently fail if audio can't play
          });
          set({ orders: [order, ...state.orders], isPlaying: true });
        } else {
          set({ orders: [order, ...state.orders] });
        }
      },

      updateOrderStatus: async (orderId, status) => {
        try {
          await ordersAPI.updateStatus(orderId, status);
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId
                ? { ...order, status, updatedAt: new Date().toISOString() }
                : order
            ),
          }));
        } catch (error) {
          console.error('Failed to update status:', error);
          throw error;
        }
      },

      selectOrder: (order) => set({ selectedOrder: order }),

      toggleSound: () => {
        const state = get();
        const newEnabled = !state.soundEnabled;
        
        // ถ้าปิดเสียง ให้หยุดเสียงด้วย
        if (!newEnabled && notificationAudio) {
          notificationAudio.pause();
          notificationAudio.currentTime = 0;
          set({ soundEnabled: false, isPlaying: false });
        } else {
          set({ soundEnabled: newEnabled });
        }
      },

      stopSound: () => {
        if (notificationAudio) {
          notificationAudio.pause();
          notificationAudio.currentTime = 0;
        }
        set({ isPlaying: false });
      },

      connectSocket: () => {
        const existingSocket = get().socket;
        if (existingSocket?.connected) return;

        const socket = io(API_URL, {
          transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
          if (import.meta.env.DEV) {
            console.debug('Socket connected:', socket.id);
          }
          socket.emit('join_admin');
        });

        socket.on('new_order', (order: unknown) => {
          if (import.meta.env.DEV) {
            console.debug('New order received:', order);
          }
          // Use shared mapping function
          const mappedOrder = mapOrderFromAPI(order as Parameters<typeof mapOrderFromAPI>[0]);
          get().addOrder(mappedOrder);
        });

        socket.on('order_updated', (order: { id: string; status: OrderStatus; updated_at: string }) => {
          if (import.meta.env.DEV) {
            console.debug('Order updated:', order);
          }
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === order.id ? { ...o, status: order.status, updatedAt: order.updated_at } : o
            ),
          }));
        });

        socket.on('disconnect', () => {
          if (import.meta.env.DEV) {
            console.debug('Socket disconnected');
          }
        });

        set({ socket });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },
    }),
    {
      name: 'tum-panich-admin-sound',
      partialize: (state) => ({ soundEnabled: state.soundEnabled }), // persist only soundEnabled
    }
  )
);

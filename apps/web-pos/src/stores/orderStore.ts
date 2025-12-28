import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { Order, OrderStatus } from '../types';
import { ordersAPI } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  newOrderSound: boolean;
  loading: boolean;
  socket: Socket | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  selectOrder: (order: Order | null) => void;
  playNewOrderSound: () => void;
  stopNewOrderSound: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// Create notification audio element
let notificationAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  notificationAudio = new Audio('/sounds/notification.mp3');
  notificationAudio.loop = true;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  newOrderSound: false,
  loading: false,
  socket: null,

  setOrders: (orders) => set({ orders }),
  
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const orders = await ordersAPI.getAll();
      // Map API response to frontend format
      const mappedOrders = orders.map((o: any) => ({
        id: o.id,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
        totalAmount: parseFloat(o.total_amount),
        status: o.status,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        deliveryType: o.delivery_type,
        deliveryAddress: o.delivery_address,
        landmark: o.landmark,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        slipImage: o.slip_image_url,
        lineUserId: o.line_user_id,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
      }));
      set({ orders: mappedOrders, loading: false });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ loading: false });
    }
  },
  
  addOrder: (order) => set((state) => {
    // Play notification sound
    notificationAudio?.play().catch(() => {});
    return { orders: [order, ...state.orders], newOrderSound: true };
  }),

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

  playNewOrderSound: () => {
    notificationAudio?.play().catch(() => {});
    set({ newOrderSound: true });
  },

  stopNewOrderSound: () => {
    notificationAudio?.pause();
    if (notificationAudio) notificationAudio.currentTime = 0;
    set({ newOrderSound: false });
  },

  connectSocket: () => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) return;

    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join_admin');
    });

    socket.on('new_order', (order: any) => {
      console.log('New order received:', order);
      const mappedOrder = {
        id: order.id,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        deliveryType: order.delivery_type,
        deliveryAddress: order.delivery_address,
        landmark: order.landmark,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        slipImage: order.slip_image_url,
        lineUserId: order.line_user_id,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      };
      get().addOrder(mappedOrder);
    });

    socket.on('order_updated', (order: any) => {
      console.log('Order updated:', order);
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === order.id ? { ...o, status: order.status, updatedAt: order.updated_at } : o
        ),
      }));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
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
}));

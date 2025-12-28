import { create } from 'zustand';
import { Order, OrderStatus } from '../types';

// Mock orders สำหรับทดสอบ
const MOCK_ORDERS: Order[] = [
  {
    id: 'TP1735350000001',
    items: [
      { id: '1', productId: 'rice-1', productName: 'ข้าวหมูแดงสันคอ', price: 50, note: 'ไม่ใส่ผัก' },
      { id: '2', productId: 'rice-1', productName: 'ข้าวหมูแดงสันคอ', price: 50, note: 'ขอหมูแดงล้วน' },
      { id: '3', productId: 'rice-2', productName: 'ข้าวหมูกรอบ', price: 60 },
    ],
    totalAmount: 160,
    status: 'pending',
    customerName: 'คุณสมชาย ใจดี',
    customerPhone: '081-234-5678',
    deliveryType: 'free-delivery',
    deliveryAddress: '123/45 หมู่ 6 ต.ศาลาแดง อ.เมือง จ.อ่างทอง',
    landmark: 'ติดกับเซเว่น ตรงข้าม ธ.กรุงไทย',
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'TP1735350000002',
    items: [
      { id: '4', productId: 'noodle-1', productName: 'ก๋วยเตี๋ยวหมูแดง', price: 45, options: { 'noodle-type': 'เส้นเล็ก' } },
    ],
    totalAmount: 45,
    status: 'cooking',
    customerName: 'คุณมานี มีทรัพย์',
    customerPhone: '089-876-5432',
    deliveryType: 'pickup',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
];

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  newOrderSound: boolean;
  
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  selectOrder: (order: Order | null) => void;
  playNewOrderSound: () => void;
  stopNewOrderSound: () => void;
}

// Create notification audio element
let notificationAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  notificationAudio = new Audio('/sounds/notification.mp3');
  notificationAudio.loop = true;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: MOCK_ORDERS,
  selectedOrder: null,
  newOrderSound: false,

  setOrders: (orders) => set({ orders }),
  
  addOrder: (order) => set((state) => {
    // Play notification sound
    notificationAudio?.play().catch(() => {});
    return { orders: [order, ...state.orders], newOrderSound: true };
  }),

  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map((order) =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ),
  })),

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
}));

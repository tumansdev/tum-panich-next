// Socket.io client for LIFF app real-time updates
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

let socket: Socket | null = null;

/**
 * Connect to Socket.io server
 */
export function connectSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    if (import.meta.env.DEV) {
      console.log('Socket connected:', socket?.id);
    }
  });

  socket.on('disconnect', () => {
    if (import.meta.env.DEV) {
      console.log('Socket disconnected');
    }
  });

  return socket;
}

/**
 * Join order room to receive status updates
 */
export function joinOrderRoom(orderId: string): void {
  if (!socket?.connected) {
    connectSocket();
  }
  socket?.emit('join_order', orderId);
}

/**
 * Leave order room
 */
export function leaveOrderRoom(orderId: string): void {
  socket?.emit('leave_order', orderId);
}

/**
 * Listen for order status updates
 */
export function onOrderStatusUpdate(
  callback: (data: { orderId: string; status: string }) => void
): () => void {
  if (!socket?.connected) {
    connectSocket();
  }

  const handler = (data: { orderId: string; status: string }) => {
    callback(data);
  };

  socket?.on('order_status_updated', handler);

  // Return cleanup function
  return () => {
    socket?.off('order_status_updated', handler);
  };
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export { socket };

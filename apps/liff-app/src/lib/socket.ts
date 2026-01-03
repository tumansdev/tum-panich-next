import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
  }
}

// Join store status room for real-time updates
export function joinStoreStatusRoom(): void {
  const s = getSocket();
  s.emit('join_store_status');
}

// Subscribe to store status changes
export function onStoreStatusChanged(callback: (status: { isOpen: boolean; message: string; closeTime: string | null }) => void): () => void {
  const s = getSocket();
  s.on('store_status_changed', callback);
  
  // Return unsubscribe function
  return () => {
    s.off('store_status_changed', callback);
  };
}

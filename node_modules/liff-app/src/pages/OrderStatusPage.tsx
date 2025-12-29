import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, RefreshCw, Clock, Check, ChefHat, Package, Truck, CheckCircle, LucideIcon } from 'lucide-react';
import { OrderStatus } from '../types';
import { sendMessage, closeLiff, isInLiff } from '../lib/liff';
import { ordersAPI } from '../lib/api';
import { connectSocket, joinOrderRoom, leaveOrderRoom, onOrderStatusUpdate } from '../lib/socket';

interface OrderStatusPageProps {
  orderId: string;
  onBack: () => void;
}

// Status configuration
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: LucideIcon }> = {
  pending: { label: 'รอร้านยืนยัน', color: 'amber', icon: Clock },
  confirmed: { label: 'รับออเดอร์แล้ว', color: 'blue', icon: Check },
  cooking: { label: 'กำลังปรุงอาหาร', color: 'orange', icon: ChefHat },
  ready: { label: 'พร้อมรับ/ส่ง', color: 'green', icon: Package },
  delivered: { label: 'กำลังจัดส่ง', color: 'purple', icon: Truck },
  completed: { label: 'เสร็จสิ้น', color: 'green', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', color: 'red', icon: Clock },
};

interface OrderData {
  id: string;
  status: OrderStatus;
  total_amount: number;
  customer_name: string;
  delivery_type: string;
  created_at: string;
  items: Array<{
    productName: string;
    price: number;
  }>;
}

export function OrderStatusPage({ orderId, onBack }: OrderStatusPageProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch order and setup real-time updates
  useEffect(() => {
    let cleanupSocket: (() => void) | null = null;

    async function init() {
      try {
        // Fetch order data
        const data = await ordersAPI.getById(orderId);
        setOrder(data);
        setCurrentStatus(data.status as OrderStatus);
        setLoading(false);

        // Connect to Socket.io
        connectSocket();
        joinOrderRoom(orderId);

        // Listen for status updates
        cleanupSocket = onOrderStatusUpdate((updateData) => {
          if (updateData.orderId === orderId) {
            setCurrentStatus(updateData.status as OrderStatus);
          }
        });
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('ไม่สามารถโหลดข้อมูลออเดอร์ได้');
        setLoading(false);
      }
    }

    init();

    return () => {
      leaveOrderRoom(orderId);
      if (cleanupSocket) cleanupSocket();
    };
  }, [orderId]);

  const handleContact = async () => {
    if (isInLiff()) {
      await sendMessage(`สอบถามออเดอร์ #${orderId.slice(-8)}`);
      closeLiff();
    } else {
      window.location.href = 'tel:0841158342';
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getById(orderId);
      setOrder(data);
      setCurrentStatus(data.status as OrderStatus);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
          <div className="h-6 w-40 bg-slate-200 rounded" />
        </div>
        <div className="h-32 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-xl" />
        <div className="h-40 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">สถานะคำสั่งซื้อ</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-700">{error}</p>
          <button onClick={handleRefresh} className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Order ID Display */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">หมายเลขออเดอร์</p>
          <p className="text-lg font-bold font-mono text-slate-800">#{orderId.slice(-8)}</p>
        </div>
        <button onClick={handleRefresh} className="p-3 bg-slate-100 rounded-xl" disabled={loading}>
          <RefreshCw size={18} className={`text-slate-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status Card */}
      <div className={`bg-${statusConfig.color}-50 border border-${statusConfig.color}-200 rounded-xl p-4 text-center`}>
        <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-${statusConfig.color}-100 flex items-center justify-center`}>
          <StatusIcon size={32} className={`text-${statusConfig.color}-600`} />
        </div>
        <h3 className={`font-bold text-${statusConfig.color}-800 text-lg`}>{statusConfig.label}</h3>
        <p className="text-sm text-slate-600 mt-1">
          {currentStatus === 'pending' && 'ร้านกำลังยืนยันออเดอร์ของคุณ'}
          {currentStatus === 'confirmed' && 'ร้านรับออเดอร์แล้ว กำลังเตรียมวัตถุดิบ'}
          {currentStatus === 'cooking' && 'อาหารของคุณกำลังปรุง รอสักครู่นะคะ'}
          {currentStatus === 'ready' && 'อาหารพร้อมแล้ว! รอรับหรือรอไรเดอร์'}
          {currentStatus === 'delivered' && 'ไรเดอร์กำลังเดินทางไปหาคุณ'}
          {currentStatus === 'completed' && 'ขอบคุณที่ใช้บริการ! ♥'}
          {currentStatus === 'cancelled' && 'ออเดอร์ถูกยกเลิก'}
        </p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">ไทม์ไลน์</h3>
        <div className="space-y-3">
          {(['pending', 'confirmed', 'cooking', 'ready', 'completed'] as OrderStatus[]).map((status, index) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const isPast = ['pending', 'confirmed', 'cooking', 'ready', 'delivered', 'completed'].indexOf(currentStatus) >= index;
            const isCurrent = currentStatus === status;

            return (
              <div key={status} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrent ? `bg-${config.color}-500 text-white` : 
                  isPast ? `bg-${config.color}-100 text-${config.color}-600` : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  <Icon size={16} />
                </div>
                <span className={`text-sm ${isCurrent ? 'font-bold text-slate-800' : isPast ? 'text-slate-600' : 'text-slate-400'}`}>
                  {config.label}
                </span>
                {isCurrent && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">
                    ปัจจุบัน
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      {order && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3">รายละเอียดคำสั่งซื้อ</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">หมายเลขออเดอร์</span>
              <span className="font-mono font-medium">#{orderId.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">วันเวลา</span>
              <span className="font-medium">
                {order.created_at ? new Date(order.created_at).toLocaleString('th-TH') : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ชื่อลูกค้า</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">วิธีรับอาหาร</span>
              <span className="font-medium">
                {order.delivery_type === 'pickup' ? '🏪 รับเอง' : '🚗 จัดส่ง'}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-center">
              <span className="font-bold text-slate-800">รวมทั้งหมด</span>
              <span className="text-xl font-bold text-brand-700">฿{order.total_amount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="font-bold text-amber-800 mb-2">ติดต่อร้าน</h4>
        <p className="text-sm text-amber-700 mb-3">
          หากมีข้อสงสัย หรือต้องการสอบถามเพิ่มเติม
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleContact}
            className="flex-1 bg-brand-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            แชท
          </button>
          <a
            href="tel:0841158342"
            className="flex-1 bg-white text-brand-600 border border-brand-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            โทร
          </a>
        </div>
      </div>

      {/* Back to Home */}
      <button
        onClick={onBack}
        className="w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-xl"
      >
        กลับหน้าแรก
      </button>
    </div>
  );
}

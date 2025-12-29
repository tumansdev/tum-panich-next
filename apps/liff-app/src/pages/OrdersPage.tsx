import { useState, useEffect } from 'react';
import { Clock, Package, Truck, CheckCircle, ChevronRight, History, AlertCircle, RefreshCw } from 'lucide-react';
import { ordersAPI } from '../lib/api';

type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'ready' | 'delivered' | 'completed' | 'cancelled';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  note?: string;
  options?: Record<string, string>;
}

interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  delivery_type: string;
  created_at: string;
  customer_name: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'รอยืนยัน', color: 'bg-amber-100 text-amber-700', icon: Clock },
  confirmed: { label: 'รับออเดอร์แล้ว', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  cooking: { label: 'กำลังปรุง', color: 'bg-orange-100 text-orange-700', icon: Package },
  ready: { label: 'พร้อมรับ/ส่ง', color: 'bg-green-100 text-green-700', icon: Package },
  delivered: { label: 'กำลังจัดส่ง', color: 'bg-purple-100 text-purple-700', icon: Truck },
  completed: { label: 'เสร็จสิ้น', color: 'bg-slate-100 text-slate-600', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

interface OrdersPageProps {
  onOrderClick?: (orderId: string) => void;
}

export function OrdersPage({ onOrderClick }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'history'>('active');

  // Get LINE user ID from localStorage
  const lineUserId = localStorage.getItem('liff_user_id');

  // Fetch orders
  const fetchOrders = async () => {
    if (!lineUserId) {
      setLoading(false);
      return;
    }
    
    // Don't set loading to true on background refreshes, only initial load
    if (orders.length === 0) setLoading(true);
    
    try {
      const data = await ordersAPI.getByUser(lineUserId);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchOrders();
    
    // Poll for updates every 10 seconds (faster updates)
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [lineUserId]);

  const activeOrders = orders.filter(o => 
    ['pending', 'confirmed', 'cooking', 'ready', 'delivered'].includes(o.status)
  );
  const historyOrders = orders.filter(o => 
    ['completed', 'cancelled'].includes(o.status)
  );

  const displayOrders = selectedFilter === 'active' ? activeOrders : historyOrders;

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Parse items (may be JSON string from API)
  const parseItems = (items: OrderItem[] | string): OrderItem[] => {
    if (typeof items === 'string') {
      try {
        return JSON.parse(items);
      } catch {
        return [];
      }
    }
    return items;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <h2 className="text-xl font-bold text-slate-800">ออเดอร์ของฉัน</h2>
          <p className="text-sm text-slate-500">ติดตามสถานะและดูประวัติการสั่งซื้อ</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchOrders(); }}
          disabled={loading}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin text-brand-600' : 'text-slate-600'} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setSelectedFilter('active')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            selectedFilter === 'active'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <Package size={16} className="inline-block mr-1" />
          กำลังดำเนินการ
          {activeOrders.length > 0 && (
            <span className="ml-1 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSelectedFilter('history')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            selectedFilter === 'history'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <History size={16} className="inline-block mr-1" />
          ประวัติ
        </button>
      </div>

      {/* Loading */}
      {loading && orders.length === 0 && (
        <div className="text-center py-8">
          <RefreshCw size={24} className="animate-spin mx-auto text-brand-600" />
          <p className="text-sm text-slate-500 mt-2">กำลังโหลด...</p>
        </div>
      )}

      {/* Not logged in */}
      {!lineUserId && !loading && (
        <div className="text-center py-12 bg-amber-50 rounded-2xl border border-amber-200">
          <p className="text-amber-700 font-medium">⚠️ กรุณาเข้าสู่ระบบผ่าน LINE</p>
          <p className="text-amber-600 text-sm mt-1">เพื่อดูประวัติการสั่งซื้อของคุณ</p>
        </div>
      )}

      {/* Orders List */}
      {lineUserId && displayOrders.length > 0 && (
        <div className="space-y-3">
          {displayOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            const items = parseItems(order.items);

            return (
              <div
                key={order.id}
                onClick={() => onOrderClick && onOrderClick(order.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500">{order.id}</p>
                    <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-slate-100 pt-3 mb-3">
                  {items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-slate-600 mb-1">
                      <span className="truncate flex-1">{item.productName}</span>
                      <span className="ml-2">฿{item.price}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-slate-400">+{items.length - 3} รายการอื่น</p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.delivery_type === 'pickup' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {order.delivery_type === 'pickup' ? '🏪 รับเอง' : '🚗 จัดส่ง'}
                    </span>
                  </div>
                  <span className="font-bold text-brand-700">฿{order.total_amount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && lineUserId && displayOrders.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
            {selectedFilter === 'active' ? (
              <Package size={32} className="text-slate-400" />
            ) : (
              <History size={32} className="text-slate-400" />
            )}
          </div>
          <p className="text-slate-500 font-medium">
            {selectedFilter === 'active' 
              ? 'ไม่มีออเดอร์ที่กำลังดำเนินการ'
              : 'ยังไม่มีประวัติการสั่งซื้อ'
            }
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {selectedFilter === 'active' 
              ? 'เริ่มสั่งอาหารอร่อยๆ กันเลย!'
              : 'ออเดอร์ที่เสร็จสิ้นจะแสดงที่นี่'
            }
          </p>
        </div>
      )}

      {/* Status Legend */}
      {selectedFilter === 'active' && activeOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">📊 สถานะออเดอร์</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-slate-600">รอยืนยัน</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-slate-600">กำลังปรุง</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-slate-600">พร้อมรับ</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-slate-600">กำลังจัดส่ง</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

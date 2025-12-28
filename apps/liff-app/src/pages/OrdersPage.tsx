import { useState } from 'react';
import { Clock, Package, Truck, CheckCircle, ChevronRight, History, AlertCircle } from 'lucide-react';

// Mock order data - จะเชื่อมกับ backend ภายหลัง
const MOCK_ORDERS = [
  {
    id: 'ORD-20251228-001',
    date: '28 ธ.ค. 2567 10:30',
    items: [
      { name: 'ก๋วยเตี๋ยวหมูแดง', quantity: 2, price: 50 },
      { name: 'หมูกรอบ', quantity: 1, price: 60 },
    ],
    total: 160,
    status: 'cooking' as OrderStatus,
    deliveryType: 'delivery',
  },
  {
    id: 'ORD-20251227-003',
    date: '27 ธ.ค. 2567 12:15',
    items: [
      { name: 'ก๋วยเตี๋ยวต้มยำ', quantity: 1, price: 55 },
    ],
    total: 55,
    status: 'completed' as OrderStatus,
    deliveryType: 'pickup',
  },
];

type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'ready' | 'delivering' | 'completed' | 'cancelled';

const STATUS_CONFIG = {
  pending: { label: 'รอยืนยัน', color: 'bg-amber-100 text-amber-700', icon: Clock },
  confirmed: { label: 'รับออเดอร์แล้ว', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  cooking: { label: 'กำลังปรุง', color: 'bg-orange-100 text-orange-700', icon: Package },
  ready: { label: 'พร้อมรับ/ส่ง', color: 'bg-green-100 text-green-700', icon: Package },
  delivering: { label: 'กำลังจัดส่ง', color: 'bg-purple-100 text-purple-700', icon: Truck },
  completed: { label: 'เสร็จสิ้น', color: 'bg-slate-100 text-slate-600', icon: CheckCircle },
  cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

interface OrdersPageProps {
  onViewOrderStatus?: (orderId: string) => void;
}

export function OrdersPage({ onViewOrderStatus }: OrdersPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'active' | 'history'>('active');

  const activeOrders = MOCK_ORDERS.filter(o => 
    ['pending', 'confirmed', 'cooking', 'ready', 'delivering'].includes(o.status)
  );
  const historyOrders = MOCK_ORDERS.filter(o => 
    ['completed', 'cancelled'].includes(o.status)
  );

  const displayOrders = selectedFilter === 'active' ? activeOrders : historyOrders;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">ออเดอร์ของฉัน</h2>
        <p className="text-sm text-slate-500">ติดตามสถานะและดูประวัติการสั่งซื้อ</p>
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

      {/* Orders List */}
      {displayOrders.length > 0 ? (
        <div className="space-y-3">
          {displayOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status];
            const StatusIcon = statusConfig.icon;

            return (
              <button
                key={order.id}
                onClick={() => onViewOrderStatus?.(order.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-left active:scale-[0.98] transition-transform"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500">{order.id}</p>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-slate-100 pt-3 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>{item.name} x{item.quantity}</span>
                      <span>฿{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.deliveryType === 'delivery' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {order.deliveryType === 'delivery' ? '🚗 จัดส่ง' : '🏪 รับเอง'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-700">฿{order.total}</span>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
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

      {/* Status Legend (for active orders) */}
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

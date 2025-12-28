import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { OrderCard } from '../components/OrderCard';
import { MenuPage } from './MenuPage';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Settings, 
  LogOut,
  Bell,
  BellOff,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { OrderStatus } from '../types';

type Tab = 'orders' | 'menu' | 'settings';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const { 
    orders, 
    updateOrderStatus, 
    soundEnabled,
    isPlaying,
    toggleSound,
    stopSound,
    fetchOrders,
    connectSocket,
    disconnectSocket,
  } = useOrderStore();
  const logout = useAuthStore((state) => state.logout);

  // Connect Socket.IO and fetch orders on mount
  useEffect(() => {
    connectSocket();
    fetchOrders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, []);

  // Filter orders by status
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => ['confirmed', 'cooking', 'ready'].includes(o.status));
  const completedOrders = orders.filter((o) => ['delivered', 'completed'].includes(o.status));

  const handleRefresh = () => {
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-brand-700">ตั้มพานิช</h1>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<ShoppingBag size={20} />} 
            label="ออเดอร์" 
            badge={pendingOrders.length || undefined}
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          />
          <NavItem 
            icon={<UtensilsCrossed size={20} />} 
            label="จัดการเมนู" 
            active={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')}
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="ตั้งค่า" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">จัดการออเดอร์</h2>
                <p className="text-slate-500">รวม {orders.length} ออเดอร์</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Test Sound - เพื่อ unlock browser autoplay */}
                <button
                  onClick={() => {
                    // เล่นเสียงทดสอบเพื่อ unlock browser autoplay
                    const audio = new Audio('/sounds/notification.mp3');
                    audio.volume = 0.5;
                    audio.play().then(() => {
                      setTimeout(() => audio.pause(), 1000);
                      alert('✅ เสียงทำงานปกติ! เมื่อมีออเดอร์ใหม่จะได้ยินเสียงแจ้งเตือน');
                    }).catch((e) => {
                      console.error('Audio error:', e);
                      alert('❌ ไม่สามารถเล่นเสียงได้ กรุณาตรวจสอบ:\n1. เปิดเสียงลำโพง\n2. ไม่ได้ปิดเสียงหน้าเว็บ');
                    });
                  }}
                  className="px-3 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 text-sm font-medium"
                >
                  🔊 ทดสอบเสียง
                </button>

                {/* Sound Toggle */}
                <button
                  onClick={() => {
                    // เปิด/ปิดเสียง
                    toggleSound();
                  }}
                  className={`p-3 rounded-xl transition-colors ${
                    soundEnabled 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-slate-100 text-slate-400'
                  } ${isPlaying ? 'animate-pulse ring-2 ring-red-400' : ''}`}
                  title={soundEnabled ? 'เสียงเปิดอยู่ (คลิกเพื่อปิด)' : 'เสียงปิดอยู่ (คลิกเพื่อเปิด)'}
                >
                  {soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                </button>
                
                {/* Stop Playing Sound */}
                {isPlaying && (
                  <button
                    onClick={stopSound}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium animate-pulse"
                  >
                    หยุดเสียง
                  </button>
                )}
                
                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  className="p-3 bg-brand-100 text-brand-700 rounded-xl hover:bg-brand-200 transition-colors"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            {/* Order Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                  <h3 className="font-bold text-slate-800">รอยืนยัน ({pendingOrders.length})</h3>
                </div>
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={() => {}}
                      onUpdateStatus={(status: OrderStatus) => updateOrderStatus(order.id, status)}
                    />
                  ))}
                  {pendingOrders.length === 0 && (
                    <div className="text-center py-8 text-slate-400">ไม่มีออเดอร์รอยืนยัน</div>
                  )}
                </div>
              </div>

              {/* Active */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <h3 className="font-bold text-slate-800">กำลังดำเนินการ ({activeOrders.length})</h3>
                </div>
                <div className="space-y-3">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={() => {}}
                      onUpdateStatus={(status: OrderStatus) => updateOrderStatus(order.id, status)}
                    />
                  ))}
                  {activeOrders.length === 0 && (
                    <div className="text-center py-8 text-slate-400">ไม่มีออเดอร์ที่กำลังทำ</div>
                  )}
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-slate-800">เสร็จสิ้น ({completedOrders.length})</h3>
                </div>
                <div className="space-y-3">
                  {completedOrders.slice(0, 5).map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={() => {}}
                      onUpdateStatus={(status: OrderStatus) => updateOrderStatus(order.id, status)}
                    />
                  ))}
                  {completedOrders.length === 0 && (
                    <div className="text-center py-8 text-slate-400">ยังไม่มีออเดอร์เสร็จ</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && <MenuPage />}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">ตั้งค่า</h2>
            <p className="text-slate-500">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  badge,
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-brand-50 text-brand-700 font-bold' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

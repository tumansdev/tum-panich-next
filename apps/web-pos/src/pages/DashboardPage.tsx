import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';
import { OrderCard } from '../components/OrderCard';
import { MenuPage } from './MenuPage';
import { SettingsPage } from './SettingsPage';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Settings, 
  LogOut,
  Bell,
  BellOff,
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { OrderStatus } from '../types';

type Tab = 'orders' | 'menu' | 'settings';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  // Filter orders by status
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => ['confirmed', 'cooking', 'ready'].includes(o.status));
  const completedOrders = orders.filter((o) => ['delivered', 'completed'].includes(o.status));

  const handleRefresh = () => {
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 flex items-center justify-between px-4 h-14">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-xl"
        >
          <Menu size={24} className="text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-brand-700">ตั้มพานิช Admin</h1>
        <div className="flex items-center gap-2">
          {pendingOrders.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingOrders.length}
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-slate-100 rounded-xl"
          >
            <RefreshCw size={20} className="text-slate-600" />
          </button>
        </div>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white shadow-lg flex flex-col z-50
        w-64 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-brand-700">ตั้มพานิช</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
          >
            <X size={20} className="text-slate-500" />
          </button>
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
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6">
          {activeTab === 'orders' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Header - Desktop */}
              <div className="hidden lg:flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">จัดการออเดอร์</h2>
                  <p className="text-slate-500">รวม {orders.length} ออเดอร์</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Test Sound */}
                  <button
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      const originalText = btn.textContent;
                      const audio = new Audio('/admin/sounds/notification.mp3');
                      audio.volume = 0.5;
                      audio.play().then(() => {
                        setTimeout(() => audio.pause(), 1000);
                        btn.textContent = '✅ เสียง OK!';
                        btn.className = 'px-3 py-2 bg-green-500 text-white rounded-xl text-sm font-medium';
                        setTimeout(() => {
                          btn.textContent = originalText;
                          btn.className = 'px-3 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 text-sm font-medium';
                        }, 2000);
                      }).catch(() => {
                        btn.textContent = '❌ เสียงไม่ทำงาน';
                        btn.className = 'px-3 py-2 bg-red-500 text-white rounded-xl text-sm font-medium';
                        setTimeout(() => {
                          btn.textContent = originalText;
                          btn.className = 'px-3 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 text-sm font-medium';
                        }, 2000);
                      });
                    }}
                    className="px-3 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 text-sm font-medium"
                  >
                    🔊 ทดสอบเสียง
                  </button>

                  {/* Sound Toggle */}
                  <button
                    onClick={toggleSound}
                    className={`p-3 rounded-xl transition-colors ${
                      soundEnabled 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-slate-100 text-slate-400'
                    } ${isPlaying ? 'animate-pulse ring-2 ring-red-400' : ''}`}
                    title={soundEnabled ? 'เสียงเปิดอยู่' : 'เสียงปิดอยู่'}
                  >
                    {soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                  </button>
                  
                  {/* Stop Sound */}
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

              {/* Mobile Stats Bar */}
              <div className="lg:hidden flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                <div className="text-sm">
                  <span className="text-slate-500">รวม</span>
                  <span className="ml-1 font-bold text-slate-800">{orders.length} ออเดอร์</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    className={`p-2 rounded-lg ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                  </button>
                  {isPlaying && (
                    <button onClick={stopSound} className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg animate-pulse">
                      หยุด
                    </button>
                  )}
                </div>
              </div>

              {/* Order Columns - Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {/* Pending */}
                <div className="bg-amber-50/50 rounded-2xl p-4">
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
                <div className="bg-blue-50/50 rounded-2xl p-4">
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
                <div className="bg-green-50/50 rounded-2xl p-4 md:col-span-2 xl:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <h3 className="font-bold text-slate-800">เสร็จสิ้น ({completedOrders.length})</h3>
                  </div>
                  <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 xl:block xl:space-y-3">
                    {completedOrders.slice(0, 5).map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onSelect={() => {}}
                        onUpdateStatus={(status: OrderStatus) => updateOrderStatus(order.id, status)}
                      />
                    ))}
                    {completedOrders.length === 0 && (
                      <div className="text-center py-8 text-slate-400 md:col-span-2 xl:col-span-1">ยังไม่มีออเดอร์เสร็จ</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && <MenuPage />}

          {activeTab === 'settings' && <SettingsPage />}
        </div>
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
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all min-h-[48px] ${
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

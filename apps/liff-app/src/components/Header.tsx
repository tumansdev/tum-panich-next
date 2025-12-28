import { Home, ClipboardList, ShoppingBag, BookOpen, User, ArrowLeft, ChevronRight } from 'lucide-react';

type Tab = 'home' | 'orders' | 'cart' | 'story' | 'profile';
type View = 'main' | 'checkout' | 'order-status' | 'menu';

interface HeaderProps {
  activeTab: Tab;
  view: View;
  onBack?: () => void;
}

const tabNames: Record<Tab, { name: string; icon: typeof Home }> = {
  home: { name: 'หน้าแรก', icon: Home },
  orders: { name: 'ออเดอร์ของฉัน', icon: ClipboardList },
  cart: { name: 'ตะกร้า', icon: ShoppingBag },
  story: { name: 'เรื่องราวของเรา', icon: BookOpen },
  profile: { name: 'โปรไฟล์', icon: User },
};

const viewNames: Record<View, string> = {
  main: '',
  checkout: 'ชำระเงิน',
  'order-status': 'สถานะออเดอร์',
  menu: 'เมนูทั้งหมด',
};

export function Header({ activeTab, view, onBack }: HeaderProps) {
  const isMainView = view === 'main';
  const currentTab = tabNames[activeTab];
  const viewName = viewNames[view];
  const Icon = currentTab.icon;

  // ไม่แสดง Header ในหน้าแรก (มี Hero Section แล้ว)
  if (isMainView && activeTab === 'home') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100 -mx-4 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        {!isMainView && onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-full"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <Icon size={20} className="text-brand-600 flex-shrink-0" />
          <span className="font-bold text-slate-800 truncate">
            {currentTab.name}
          </span>
          {viewName && (
            <>
              <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-brand-600 font-medium truncate">{viewName}</span>
            </>
          )}
        </div>

        {/* Logo */}
        <img 
          src="/images/logo.png" 
          alt="ตั้มพานิช" 
          className="w-8 h-8 rounded-lg shadow-sm border border-slate-100" 
        />
      </div>
    </header>
  );
}

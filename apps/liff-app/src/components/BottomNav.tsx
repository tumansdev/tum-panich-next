import { Home, UtensilsCrossed, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

type Tab = 'home' | 'menu' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const itemCount = useCartStore((state) => state.getItemCount());

  const tabs = [
    { id: 'home' as Tab, label: 'หน้าแรก', icon: Home },
    { id: 'menu' as Tab, label: 'เมนู', icon: UtensilsCrossed },
    { id: 'cart' as Tab, label: 'ตะกร้า', icon: ShoppingBag, badge: itemCount },
    { id: 'profile' as Tab, label: 'โปรไฟล์', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                isActive ? 'text-brand-600' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

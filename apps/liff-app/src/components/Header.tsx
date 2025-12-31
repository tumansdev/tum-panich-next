import { ArrowLeft, User } from 'lucide-react';
import { LiffProfile } from '../types';

type View = 'main' | 'checkout' | 'order-status' | 'menu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  view: View;
  onBack?: () => void;
  profile?: LiffProfile | null;
  activeTab?: string;
}

// View titles configuration
const viewTitles: Record<View, { title: string; subtitle?: string }> = {
  main: { title: 'ตั้มพานิช', subtitle: 'ข้าวหมูแดง บะหมี่หมูแดง หมูกรอบ' },
  checkout: { title: 'ชำระเงิน', subtitle: 'ยืนยันคำสั่งซื้อ' },
  'order-status': { title: 'สถานะออเดอร์', subtitle: 'ติดตามคำสั่งซื้อ' },
  menu: { title: 'เมนูทั้งหมด', subtitle: 'เลือกเมนูโปรด' },
};

export function Header({ title, subtitle, view, onBack, profile, activeTab }: HeaderProps) {
  const isHeroMode = view === 'main' && activeTab === 'home';
  const viewConfig = viewTitles[view];
  const displayTitle = title || viewConfig.title;
  const displaySubtitle = subtitle || viewConfig.subtitle;

  if (isHeroMode) {
    return (
      <header className="relative bg-gradient-to-br from-brand-800 to-brand-600 text-white overflow-hidden shadow-xl">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl"></div>

        <div className="px-6 pt-8 pb-16 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-brand-100 text-sm font-medium mb-1">ยินดีต้อนรับ 👋</p>
              <h1 className="text-2xl font-bold tracking-tight">
                {profile?.displayName || 'คุณลูกค้า'}
              </h1>
            </div>
            {profile?.pictureUrl ? (
              <img 
                src={profile.pictureUrl} 
                alt={profile.displayName} 
                className="w-12 h-12 rounded-full border-2 border-white/30 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                <User size={24} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h2 className="text-lg font-bold mb-1">หิวหรือยังครับ? 🍜</h2>
            <p className="text-brand-50 text-sm">สั่งอาหารอร่อยๆ จากตั้มพานิชได้เลย</p>
          </div>
        </div>

        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" className="w-full h-auto translate-y-1 block text-amber-50 fill-current">
             <path fillOpacity="1" d="M0,160L60,165.3C120,171,240,181,360,176C480,171,600,149,720,138.7C840,128,960,128,1080,144C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </header>
    );
  }

  // Standard Header for other pages
  return (
    <header className="sticky top-0 z-50 bg-white text-slate-800 shadow-sm border-b border-slate-100">
      <div className="px-4 py-3 relative z-10">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors mr-3"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate tracking-tight text-slate-900">{displayTitle}</h1>
            {displaySubtitle && (
              <p className="text-slate-500 text-sm truncate font-medium">{displaySubtitle}</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

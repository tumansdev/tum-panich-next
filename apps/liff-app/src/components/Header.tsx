import { ArrowLeft } from 'lucide-react';

type View = 'main' | 'checkout' | 'order-status' | 'menu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  view: View;
  onBack?: () => void;
  showLogo?: boolean;
}

// View titles configuration
const viewTitles: Record<View, { title: string; subtitle?: string }> = {
  main: { title: 'ตั้มพานิช', subtitle: 'ข้าวหมูแดง บะหมี่หมูแดง หมูกรอบ' },
  checkout: { title: 'ชำระเงิน', subtitle: 'ยืนยันคำสั่งซื้อ' },
  'order-status': { title: 'สถานะออเดอร์', subtitle: 'ติดตามคำสั่งซื้อ' },
  menu: { title: 'เมนูทั้งหมด', subtitle: 'เลือกเมนูโปรด' },
};

export function Header({ title, subtitle, view, onBack, showLogo = true }: HeaderProps) {
  const isMainView = view === 'main';
  const viewConfig = viewTitles[view];
  const displayTitle = title || viewConfig.title;
  const displaySubtitle = subtitle || viewConfig.subtitle;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center">
          {/* Back Button */}
          {!isMainView && onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors mr-3"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}

          {/* Title & Subtitle - Left Aligned */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate tracking-tight">{displayTitle}</h1>
            {displaySubtitle && (
              <p className="text-white/90 text-sm truncate font-medium">{displaySubtitle}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Curved bottom edge */}
      <div className="h-4 bg-amber-50 rounded-t-[1.5rem] -mt-1"></div>
    </header>
  );
}

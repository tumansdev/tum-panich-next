import { ChevronRight, Sparkles } from 'lucide-react';
import { categories, menuItems } from '../data/menu';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (tab: 'menu' | 'cart') => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  // เมนูแนะนำ (สินค้า 4 ตัวแรก)
  const featuredItems = menuItems.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative h-44 bg-gradient-to-br from-brand-700 via-brand-600 to-amber-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <h2 className="text-white text-2xl font-bold mb-1">
            สวัสดีครับ! 👋
          </h2>
          <p className="text-white/90 text-sm mb-4">
            ยินดีต้อนรับสู่ร้าน ตั้มพานิช
          </p>
          <button
            onClick={() => onNavigate('menu')}
            className="self-start bg-white text-brand-700 font-bold px-5 py-2.5 rounded-full text-sm shadow-lg flex items-center gap-1"
          >
            ดูเมนูทั้งหมด
            <ChevronRight size={18} />
          </button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -right-4 top-4 w-16 h-16 bg-white/10 rounded-full" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">หมวดหมู่</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('menu')}
              className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm border border-slate-100 active:scale-95 transition-transform"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-slate-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-1">
            <Sparkles size={18} className="text-amber-500" />
            เมนูแนะนำ
          </h3>
          <button
            onClick={() => onNavigate('menu')}
            className="text-brand-600 text-sm font-medium flex items-center"
          >
            ดูทั้งหมด
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {featuredItems.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="font-bold text-amber-800 mb-2">📍 ข้อมูลร้าน</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>🕐 เปิดบริการ: 07:00 - 14:00 น.</p>
          <p>📞 โทร: 0xx-xxx-xxxx</p>
          <p className="text-xs text-amber-600 mt-2">
            * สั่งผ่าน LINE ได้ตลอดเวลา
          </p>
        </div>
      </div>
    </div>
  );
}

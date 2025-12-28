import { ChevronRight, Sparkles, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { categories, menuItems } from '../data/menu';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

// ข้อมูลร้าน
const STORE_INFO = {
  name: 'ตั้มพานิช',
  hours: 'จันทร์ - เสาร์ 10:00 - 14:00 น.',
  phone: '084-115-8342',
  mapUrl: 'https://maps.app.goo.gl/Gs4BZZ9BJDAA44LH9',
  lat: 14.584142066784167,
  lng: 100.42882812383826,
};

interface HomePageProps {
  onNavigate: (tab: 'menu' | 'cart') => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  // เมนูแนะนำ (สินค้า 4 ตัวแรก)
  const featuredItems = menuItems.slice(0, 4);

  const handleCall = () => {
    window.location.href = `tel:${STORE_INFO.phone}`;
  };

  const handleOpenMap = () => {
    window.open(STORE_INFO.mapUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-br from-brand-700 via-brand-600 to-amber-600 rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <div className="flex items-center gap-2 mb-2">
            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 rounded-xl shadow-lg" />
            <div>
              <h2 className="text-white text-2xl font-bold">
                สวัสดีครับ! 👋
              </h2>
              <p className="text-white/80 text-sm">
                ยินดีต้อนรับสู่ร้าน {STORE_INFO.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="self-start bg-white text-brand-700 font-bold px-5 py-2.5 rounded-full text-sm shadow-lg flex items-center gap-1 mt-2 hover:scale-105 transition-transform"
          >
            ดูเมนูทั้งหมด
            <ChevronRight size={18} />
          </button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -right-4 top-4 w-20 h-20 bg-white/10 rounded-full" />
      </div>

      {/* Store Info Card */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="text-xl">🏪</span>
            ข้อมูลร้าน
          </h3>
        </div>
        
        <div className="space-y-3">
          {/* เวลาเปิด-ปิด */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-xs">เวลาเปิดทำการ</p>
              <p className="font-medium text-slate-800">{STORE_INFO.hours}</p>
            </div>
          </div>

          {/* เบอร์โทร */}
          <button 
            onClick={handleCall}
            className="w-full flex items-center gap-3 text-sm p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-slate-500 text-xs">โทรสั่งอาหาร</p>
              <p className="font-medium text-blue-600">{STORE_INFO.phone}</p>
            </div>
            <span className="text-blue-500 text-xs font-medium">กดโทร →</span>
          </button>

          {/* แผนที่ */}
          <button 
            onClick={handleOpenMap}
            className="w-full flex items-center gap-3 text-sm p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center animate-bounce">
              <Navigation size={20} className="text-amber-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-slate-500 text-xs">ดูแผนที่ร้าน</p>
              <p className="font-medium text-amber-600">เปิด Google Maps</p>
            </div>
            <span className="text-amber-500 text-xs font-medium">กดดูแผนที่ →</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">หมวดหมู่</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('menu')}
              className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-slate-100 active:scale-95 transition-transform hover:shadow-md"
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
    </div>
  );
}

import { useState } from 'react';
import { ChevronRight, Sparkles, Search, Megaphone, Calendar } from 'lucide-react';
import { categories, menuItems } from '../data/menu';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

// Mock special menu announcements - จะเชื่อม backend ภายหลัง
const SPECIAL_MENUS = [
  { day: 'จันทร์', menu: 'หมูแดงพิเศษ + ไข่ลวก', emoji: '🥩' },
  { day: 'อังคาร', menu: 'ก๋วยเตี๋ยวต้มยำรวมมิตร', emoji: '🌶️' },
  { day: 'พุธ', menu: 'บะหมี่หมูกรอบน้ำ', emoji: '🍜' },
  { day: 'พฤหัสบดี', menu: 'เส้นหมี่หมูแดงแห้ง', emoji: '🥢' },
  { day: 'ศุกร์', menu: 'ก๋วยเตี๋ยวหมูตุ๋น', emoji: '🍲' },
  { day: 'เสาร์', menu: 'รวมมิตรหมูแดง+หมูกรอบ', emoji: '🎉' },
];

// หาวันปัจจุบัน
const TODAY_INDEX = new Date().getDay();
const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const todaySpecial = SPECIAL_MENUS.find(s => s.day === THAI_DAYS[TODAY_INDEX]);

interface HomePageProps {
  onNavigate: (tab: 'menu' | 'cart') => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // เมนูแนะนำ (สินค้า 4 ตัวแรก)
  const featuredItems = menuItems.slice(0, 4);
  
  // ค้นหาเมนู
  const filteredItems = searchQuery.trim() 
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-5">
      {/* Hero Logo Section */}
      <div className="relative bg-gradient-to-br from-brand-800 via-brand-700 to-amber-700 rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
        
        {/* Decorative circles */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -left-8 top-8 w-24 h-24 bg-white/5 rounded-full" />
        
        <div className="relative p-6 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="relative mb-3">
            <img 
              src="/images/logo.png" 
              alt="ตั้มพานิช" 
              className="w-24 h-24 rounded-2xl shadow-2xl border-4 border-white/20" 
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-white text-xs">เปิด</span>
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-white text-2xl font-bold mb-1">ตั้มพานิช</h1>
          <p className="text-white/80 text-sm mb-3">紅紅火火 • หมูแดงนุ่ม น้ำซุปหอม</p>
          
          {/* CTA Button */}
          <button
            onClick={() => onNavigate('menu')}
            className="bg-white text-brand-700 font-bold px-6 py-2.5 rounded-full text-sm shadow-lg flex items-center gap-1 hover:scale-105 transition-transform active:scale-95"
          >
            ดูเมนูทั้งหมด
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Special Menu Announcement */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-start gap-3 relative">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Megaphone size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-amber-800">📢 เมนูพิเศษประจำวัน</h3>
            </div>
            
            {todaySpecial ? (
              <div className="bg-white rounded-xl p-3 shadow-sm border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-amber-600" />
                  <span className="text-xs text-amber-600 font-medium">วัน{todaySpecial.day}</span>
                </div>
                <p className="text-brand-700 font-bold flex items-center gap-2">
                  <span className="text-xl">{todaySpecial.emoji}</span>
                  {todaySpecial.menu}
                </p>
              </div>
            ) : (
              <p className="text-amber-700 text-sm">วันอาทิตย์ร้านปิดครับ 🙏</p>
            )}
          </div>
        </div>
        
        {/* Weekly Menu Preview */}
        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-xs text-amber-700 font-medium mb-2">🗓️ เมนูพิเศษประจำสัปดาห์</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SPECIAL_MENUS.map((item, idx) => (
              <div 
                key={idx}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${
                  item.day === THAI_DAYS[TODAY_INDEX]
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-slate-600 border border-amber-100'
                }`}
              >
                {item.emoji} {item.day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="ค้นหาเมนูที่ต้องการ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results */}
      {filteredItems && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            🔍 ผลการค้นหา "{searchQuery}"
            <span className="text-sm font-normal text-slate-500">
              ({filteredItems.length} รายการ)
            </span>
          </h3>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <ProductCard 
                  key={item.id} 
                  product={item}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <p className="text-slate-500">ไม่พบเมนูที่ค้นหา</p>
            </div>
          )}
        </div>
      )}

      {/* Categories (show when not searching) */}
      {!filteredItems && (
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
      )}

      {/* Featured Items (show when not searching) */}
      {!filteredItems && (
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
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Search, Bell, SlidersHorizontal, Flame, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useMenu } from '../hooks/useMenu';

interface HomePageProps {
  onNavigate: (tab: 'menu' | 'cart') => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ onNavigate, onSelectProduct }: HomePageProps) {
  const { menuItems, categories, loading, error, refetch } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // เมนูแนะนำ (สินค้า 4 ตัวแรก)
  const featuredItems = menuItems.slice(0, 4);
  
  // ค้นหาและ filter เมนู
  const filteredItems = searchQuery.trim() || activeCategory
    ? menuItems.filter(item => {
        const matchSearch = !searchQuery.trim() || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = !activeCategory || item.category === activeCategory || item.categoryId === activeCategory;
        return matchSearch && matchCategory;
      })
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-5 -mt-4">
        {/* Hero Section Skeleton */}
        <div className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 -mx-4 px-4 pt-4 pb-8 rounded-b-[2.5rem] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
          </div>
          <div className="space-y-2 mb-5">
            <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
            <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
          </div>
          <div className="h-12 bg-white/20 rounded-full animate-pulse" />
        </div>
        
        {/* Category Pills Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-slate-200 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        
        {/* Featured Items Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-100 rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 -mt-4">
      {/* Hero Section - Curved Bottom */}
      <div className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 -mx-4 px-4 pt-4 pb-8 rounded-b-[2.5rem] shadow-lg">
        {/* Top Bar: Logo + Notification */}
        <div className="flex items-center justify-between mb-6">
          <img 
            src="/images/logo.png" 
            alt="ตั้มพานิช" 
            className="w-12 h-12 rounded-xl shadow-md border-2 border-white/20" 
          />
          <button 
            onClick={refetch}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <RefreshCw size={20} className="text-white" />
          </button>
        </div>
        
        {/* Welcome Text */}
        <div className="mb-5">
          <p className="text-white/90 text-sm mb-1">สวัสดี, ร้านตั้มพานิช 👋</p>
          <h1 className="text-white text-2xl font-bold leading-tight">
            วันนี้รับ<br/>
            <span className="text-amber-200">อะไรดีครับ?</span>
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative flex items-center gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาเมนูอร่อย..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-md"
            />
          </div>
          <button 
            onClick={() => onNavigate('menu')}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md"
          >
            <SlidersHorizontal size={20} className="text-brand-600" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            !activeCategory
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          ทั้งหมด
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search/Filter Results */}
      {filteredItems && (
        <div>
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            {searchQuery ? `🔍 "${searchQuery}"` : `📂 ${categories.find(c => c.id === activeCategory)?.name || ''}`}
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

      {/* Featured Items (show when not searching/filtering) */}
      {!filteredItems && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
              เมนูแนะนำ
              <Flame size={18} className="text-orange-500" />
            </h3>
            <button
              onClick={() => onNavigate('menu')}
              className="text-brand-600 text-sm font-medium flex items-center"
            >
              ดูทั้งหมด
              <ChevronRight size={16} />
            </button>
          </div>
          
          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {featuredItems.map((item) => (
                <ProductCard 
                  key={item.id} 
                  product={item}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <p className="text-slate-500">ยังไม่มีเมนู</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

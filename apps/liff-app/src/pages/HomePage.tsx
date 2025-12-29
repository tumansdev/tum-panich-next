import { useState } from 'react';
import { ChevronRight, Search, SlidersHorizontal, Flame, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product, LiffProfile } from '../types';
import { useMenu } from '../hooks/useMenu';

interface HomePageProps {
  profile?: LiffProfile | null;
  onNavigate: (tab: 'menu' | 'cart') => void;
  onSelectProduct: (product: Product) => void;
}

export function HomePage({ profile, onNavigate, onSelectProduct }: HomePageProps) {
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
        const matchCategory = !activeCategory || item.category === activeCategory;
        return matchSearch && matchCategory;
      })
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4 pt-2">
        {/* Search Skeleton */}
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
        
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
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">😢</span>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={refetch}
          className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={18} />
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Welcome Message */}
      {profile?.displayName && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm">
            สวัสดี, <span className="font-bold text-brand-700">{profile.displayName}</span> 👋
          </p>
          <p className="text-slate-500 text-xs mt-0.5">วันนี้รับอะไรดีครับ?</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเมนูอร่อย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
          />
        </div>
        <button 
          onClick={() => onNavigate('menu')}
          className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-md"
        >
          <SlidersHorizontal size={20} className="text-white" />
        </button>
        <button 
          onClick={refetch}
          className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm"
        >
          <RefreshCw size={18} className="text-slate-600" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
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
            <div className="text-center py-8 bg-white rounded-xl border border-slate-100">
              <span className="text-4xl mb-2 block">🍜</span>
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
            <div className="text-center py-8 bg-white rounded-xl border border-slate-100">
              <span className="text-4xl mb-2 block">🍲</span>
              <p className="text-slate-500">ยังไม่มีเมนู</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

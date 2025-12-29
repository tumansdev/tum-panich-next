import { useState } from 'react';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Search, RefreshCw } from 'lucide-react';
import { useMenu } from '../hooks/useMenu';

interface MenuPageProps {
  onSelectProduct: (product: Product) => void;
}

export function MenuPage({ onSelectProduct }: MenuPageProps) {
  const { menuItems, categories, loading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items
  let filteredItems = menuItems;

  // Filter by category
  if (activeCategory !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === activeCategory);
  }

  // Filter by search
  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Search Skeleton */}
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
        
        {/* Category Pills Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-slate-200 rounded-full animate-pulse flex-shrink-0" />
          ))}
        </div>
        
        {/* Items Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-100 rounded-xl h-64 animate-pulse" />
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
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
        />
        <input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm transition-all"
        />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {filteredItems.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <div className="text-4xl mb-2">🍽️</div>
          <p className="text-slate-500">ไม่พบเมนูที่ค้นหา</p>
        </div>
      )}

      {/* Category Header (sticky) */}
      {activeCategory !== 'all' && filteredItems.length > 0 && (
        <div className="text-center text-slate-500 text-sm py-2">
          แสดง {filteredItems.length} รายการ
        </div>
      )}
    </div>
  );
}

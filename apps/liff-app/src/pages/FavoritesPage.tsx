import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useCartStore } from '../stores/cartStore';
import { Product } from '../types';

interface FavoritesPageProps {
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export function FavoritesPage({ onBack, onSelectProduct }: FavoritesPageProps) {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    if (product.options && product.options.length > 0) {
      onSelectProduct(product);
    } else {
      addToCart(product, {});
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-brand-600" fill="currentColor" />
              <h1 className="font-bold text-slate-800">รายการโปรด</h1>
            </div>
          </div>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 size={14} />
              ล้างทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-600 mb-2">ยังไม่มีรายการโปรด</h3>
            <p className="text-sm text-slate-400">กดที่ ❤️ บนเมนูเพื่อเพิ่มลงรายการโปรด</p>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium"
            >
              ดูเมนูทั้งหมด
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">{favorites.length} รายการ</p>
            
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-slate-100"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{product.name}</h4>
                  {product.description && (
                    <p className="text-xs text-slate-500 truncate">{product.description}</p>
                  )}
                  <p className="text-brand-600 font-bold mt-1">฿{product.price}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:bg-brand-700 transition-colors"
                  >
                    <ShoppingCart size={18} />
                  </button>
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

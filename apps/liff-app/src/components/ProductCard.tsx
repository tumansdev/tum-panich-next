import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../stores/cartStore';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    if (product.options && product.options.length > 0) {
      // ถ้ามี options ให้เปิด modal เลือก
      onSelect?.(product);
    } else {
      // ถ้าไม่มี options เพิ่มลงตะกร้าเลย
      addItem(product, 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 active:scale-[0.98] transition-all hover:shadow-lg">
      {/* รูปอาหาร - aspect ratio 1:1 */}
      <div className="relative aspect-square bg-gradient-to-br from-brand-50 to-amber-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-amber-50 to-orange-100">
            🍽️
          </div>
        )}
        
        {/* Badges */}
        {product.isSpecial && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            ⭐ พิเศษ
          </div>
        )}
        {product.price === 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            ฟรี!
          </div>
        )}

        {/* Quick Add Button - Floating */}
        <button
          onClick={handleAdd}
          disabled={!product.available}
          className="absolute bottom-2 right-2 w-10 h-10 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
        >
          <Plus size={22} strokeWidth={3} />
        </button>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="p-3">
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-1 mt-1">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-brand-700 font-bold text-lg">
            {product.price === 0 ? (
              <span className="text-green-600">ฟรี</span>
            ) : (
              `฿${product.price}`
            )}
          </span>

          {product.options && product.options.length > 0 && (
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              🍜 เลือกเส้น
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

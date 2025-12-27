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
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-brand-50 active:scale-[0.98] transition-transform">
      {/* รูปอาหาร */}
      <div className="relative h-28 bg-gradient-to-br from-brand-100 to-amber-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍽️
          </div>
        )}
        {product.isSpecial && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            พิเศษ
          </div>
        )}
        {product.price === 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ฟรี
          </div>
        )}
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="p-3">
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-1 mb-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-brand-700 font-bold text-lg">
            {product.price === 0 ? 'ฟรี' : `฿${product.price}`}
          </span>
          
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className="w-9 h-9 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {product.options && product.options.length > 0 && (
          <p className="text-[10px] text-amber-600 mt-1">
            🍜 เลือกเส้นได้
          </p>
        )}
      </div>
    </div>
  );
}

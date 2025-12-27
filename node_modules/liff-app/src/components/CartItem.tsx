import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCartStore } from '../stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity, selectedOptions } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };

  return (
    <div className="flex gap-3 bg-white rounded-xl p-3 shadow-sm border border-slate-100">
      {/* รูปสินค้า */}
      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-brand-100 to-amber-50 flex-shrink-0 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h3>
        
        {/* แสดง options ที่เลือก */}
        {selectedOptions && Object.keys(selectedOptions).length > 0 && (
          <div className="text-xs text-amber-600 mt-0.5">
            {Object.values(selectedOptions).join(', ')}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-brand-700 font-bold">
            ฿{product.price * quantity}
          </span>

          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                quantity === 1
                  ? 'bg-red-100 text-red-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
            </button>
            
            <span className="w-8 text-center font-bold text-slate-800">
              {quantity}
            </span>
            
            <button
              onClick={handleIncrease}
              className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

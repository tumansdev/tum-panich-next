import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { CartItem } from '../components/CartItem';

interface CartPageProps {
  onCheckout: () => void;
}

export function CartPage({ onCheckout }: CartPageProps) {
  const { items, clearCart, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={40} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">ตะกร้าว่างเปล่า</h3>
        <p className="text-slate-500 text-sm">เพิ่มอาหารที่ถูกใจลงตะกร้าเลย!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          ตะกร้าสินค้า ({items.length} รายการ)
        </h2>
        <button
          onClick={clearCart}
          className="text-red-500 text-sm font-medium flex items-center gap-1"
        >
          <Trash2 size={16} />
          ล้างตะกร้า
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <CartItem key={`${item.product.id}-${index}`} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3">สรุปรายการ</h3>
        
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <span className="text-slate-600">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium">
                ฿{item.product.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">รวมทั้งหมด</span>
            <span className="text-2xl font-bold text-brand-700">฿{total}</span>
          </div>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 to-transparent">
        <button
          onClick={onCheckout}
          className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-colors"
        >
          สั่งซื้อ • ฿{total}
        </button>
      </div>
    </div>
  );
}

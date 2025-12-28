import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { CartItemWithNote } from '../components/CartItem';

interface CartPageProps {
  onCheckout: () => void;
}

export function CartPage({ onCheckout }: CartPageProps) {
  const { items, clearCart, getTotal, getGroupedItems } = useCartStore();
  const total = getTotal();
  const groupedItems = getGroupedItems();

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
    <div className="space-y-4 pb-36">
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

      {/* Cart Items - แสดงแยกเป็นกลุ่มตามสินค้า */}
      <div className="space-y-4">
        {groupedItems.map((group) => (
          <div key={group.product.id} className="space-y-2">
            {/* หัวกลุ่ม */}
            {group.items.length > 1 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-800">{group.product.name}</span>
                <span className="bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  x{group.items.length}
                </span>
              </div>
            )}
            
            {/* รายการแต่ละจาน */}
            {group.items.map((item, index) => (
              <CartItemWithNote
                key={item.id}
                item={item}
                itemNumber={index + 1}
                totalItems={group.items.length}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3">สรุปรายการ</h3>
        
        <div className="space-y-2 text-sm">
          {groupedItems.map((group) => (
            <div key={group.product.id} className="flex justify-between">
              <span className="text-slate-600">
                {group.product.name} x{group.items.length}
              </span>
              <span className="font-medium">
                ฿{group.product.price * group.items.length}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">รวมค่าอาหาร</span>
            <span className="text-2xl font-bold text-brand-700">฿{total}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">* ไม่รวมค่าจัดส่ง (ถ้ามี)</p>
        </div>
      </div>

      {/* Fixed Checkout Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 via-amber-50/95 to-transparent">
        <button
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all hover:shadow-xl"
        >
          ดำเนินการสั่งซื้อ • ฿{total}
        </button>
      </div>
    </div>
  );
}

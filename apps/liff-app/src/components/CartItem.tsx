import { Trash2, MessageSquare } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useState } from 'react';

interface CartItemWithNoteProps {
  item: CartItemType;
  itemNumber: number;
  totalItems: number;
}

export function CartItemWithNote({ item, itemNumber, totalItems }: CartItemWithNoteProps) {
  const { removeItem, updateItemNote } = useCartStore();
  const { product, note, selectedOptions } = item;
  const [showNoteInput, setShowNoteInput] = useState(!!note);

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
      <div className="flex gap-3">
        {/* รูปสินค้า */}
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-100 to-amber-50 flex-shrink-0 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🍽️
            </div>
          )}
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-1">
                {product.name}
              </h3>
              {/* แสดง จานที่ X ของ Y */}
              {totalItems > 1 && (
                <span className="text-xs text-brand-600 font-medium">
                  จานที่ {itemNumber} / {totalItems}
                </span>
              )}
            </div>
            
            <span className="text-brand-700 font-bold text-sm">
              ฿{product.price}
            </span>
          </div>
          
          {/* แสดง options ที่เลือก */}
          {selectedOptions && Object.keys(selectedOptions).length > 0 && (
            <div className="text-xs text-amber-600 mt-0.5">
              🍜 {Object.values(selectedOptions).join(', ')}
            </div>
          )}

          {/* Note section */}
          <div className="mt-2 flex items-center gap-2">
            {showNoteInput ? (
              <input
                type="text"
                value={note}
                onChange={(e) => updateItemNote(item.id, e.target.value)}
                placeholder="เช่น ไม่ใส่ผัก, ขอหมูแดงล้วน"
                className="flex-1 text-xs px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            ) : (
              <button
                onClick={() => setShowNoteInput(true)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600"
              >
                <MessageSquare size={14} />
                เพิ่มโน้ต
              </button>
            )}
            
            {/* ปุ่มลบ */}
            <button
              onClick={() => removeItem(item.id)}
              className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

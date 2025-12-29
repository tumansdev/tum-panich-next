import { Copy, Check, MapPin, Phone, User, Clock, ChevronRight, Printer } from 'lucide-react';
import { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { printKitchenOrder } from '../lib/thermalPrinter';

interface OrderCardProps {
  order: Order;
  onSelect: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'รอยืนยัน', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  cooking: { label: 'กำลังทำ', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  ready: { label: 'พร้อมส่ง', color: 'text-green-700', bgColor: 'bg-green-100' },
  delivered: { label: 'ส่งแล้ว', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  completed: { label: 'เสร็จสิ้น', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  cancelled: { label: 'ยกเลิก', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const DELIVERY_LABELS = {
  'pickup': '🏪 รับเอง',
  'free-delivery': '🛵 ส่งฟรี',
  'easy-delivery': '📦 Easy Delivery',
};

export function OrderCard({ order, onSelect, onUpdateStatus }: OrderCardProps) {
  const [copied, setCopied] = useState(false);
  const status = STATUS_CONFIG[order.status];

  // สร้างข้อความสำหรับ copy ส่งไรเดอร์
  const generateRiderText = () => {
    const itemsText = order.items
      .map((item, i) => `${i + 1}. ${item.productName}${item.note ? ` (${item.note})` : ''}`)
      .join('\n');

    return `🍜 Order: ${order.id}
👤 ลูกค้า: ${order.customerName}
📞 โทร: ${order.customerPhone}
📍 ที่อยู่: ${order.deliveryAddress || '-'}
🔖 จุดสังเกต: ${order.landmark || '-'}

📋 รายการอาหาร:
${itemsText}

💰 รวม: ฿${order.totalAmount}
💳 ชำระ: ${order.paymentMethod === 'promptpay' ? 'โอนแล้ว ✅' : 'เก็บเงินปลายทาง'}`;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(generateRiderText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getNextStatus = (): OrderStatus | null => {
    const flow: OrderStatus[] = ['pending', 'confirmed', 'cooking', 'ready', 'delivered', 'completed'];
    const currentIndex = flow.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      return flow[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-slate-800">{order.id}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.bgColor} ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={12} />
          {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-slate-400" />
          <span className="font-medium text-slate-800">{order.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone size={14} className="text-slate-400" />
          {order.customerPhone}
        </div>
        {order.deliveryAddress && (
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin size={14} className="text-slate-400 mt-0.5" />
            <span className="line-clamp-1">{order.deliveryAddress}</span>
          </div>
        )}
      </div>

      {/* Items Preview */}
      <div className="text-sm text-slate-600 mb-3">
        {order.items.slice(0, 2).map((item, i) => (
          <span key={item.id}>
            {item.productName}
            {i < Math.min(order.items.length, 2) - 1 ? ', ' : ''}
          </span>
        ))}
        {order.items.length > 2 && (
          <span className="text-slate-400"> +{order.items.length - 2} รายการ</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{DELIVERY_LABELS[order.deliveryType]}</span>
          <span className="font-bold text-brand-700">฿{order.totalAmount}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Print Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              printKitchenOrder(order);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-all"
            title="พิมพ์ใบสั่งอาหาร"
          >
            <Printer size={14} />
            พิมพ์
          </button>

          {/* Copy Button */}
          {order.deliveryType !== 'pickup' && (
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          
          {/* Next Status Button */}
          {nextStatus && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(nextStatus);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-medium hover:bg-brand-700 transition-colors"
            >
              {STATUS_CONFIG[nextStatus].label}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

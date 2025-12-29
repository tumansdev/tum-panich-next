import { ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { OrderTracker } from '../components/OrderTracker';
import { OrderStatus } from '../types';
import { sendMessage, closeLiff, isInLiff } from '../lib/liff';

interface OrderStatusPageProps {
  orderId: string;
  onBack: () => void;
}

export function OrderStatusPage({ orderId, onBack }: OrderStatusPageProps) {
  // TODO: ใช้ Socket.io เพื่อรับสถานะ real-time
  // สำหรับตอนนี้ใช้ mock status
  const currentStatus: OrderStatus = 'pending';

  const handleContact = async () => {
    if (isInLiff()) {
      await sendMessage(`สอบถามออเดอร์ #${orderId}`);
      closeLiff();
    } else {
      // ถ้าไม่ได้อยู่ใน LINE ให้โทร
      window.location.href = 'tel:0841158342';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800">สถานะคำสั่งซื้อ</h2>
          <p className="text-sm text-slate-500">#{orderId}</p>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="font-bold text-green-800 text-lg">สั่งซื้อสำเร็จ!</h3>
        <p className="text-green-700 text-sm">ขอบคุณที่ใช้บริการ ร้าน ตั้มพานิช</p>
      </div>

      {/* Order Tracker */}
      <OrderTracker currentStatus={currentStatus} />

      {/* Order Details */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3">รายละเอียดคำสั่งซื้อ</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">หมายเลขออเดอร์</span>
            <span className="font-mono font-medium">#{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">วันเวลา</span>
            <span className="font-medium">{new Date().toLocaleString('th-TH')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">สถานะ</span>
            <span className="font-medium text-amber-600">รอร้านยืนยัน</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="font-bold text-amber-800 mb-2">ติดต่อร้าน</h4>
        <p className="text-sm text-amber-700 mb-3">
          หากมีข้อสงสัย หรือต้องการสอบถามเพิ่มเติม
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleContact}
            className="flex-1 bg-brand-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            แชท
          </button>
          <a
            href="tel:0841158342"
            className="flex-1 bg-white text-brand-600 border border-brand-600 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            โทร
          </a>
        </div>
      </div>

      {/* Back to Home */}
      <button
        onClick={onBack}
        className="w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-xl"
      >
        กลับหน้าแรก
      </button>
    </div>
  );
}

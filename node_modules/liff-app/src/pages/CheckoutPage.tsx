import { useState, useRef } from 'react';
import { ArrowLeft, MapPin, Phone, User, Upload, CheckCircle, Copy } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

// ข้อมูลบัญชีร้าน - แก้ไขตรงนี้
const BANK_INFO = {
  bankName: 'กสิกรไทย',
  accountNumber: 'xxx-x-xxxxx-x',
  accountName: 'ร้าน ตั้มพานิช',
  qrCodeImage: '/images/promptpay-qr.jpg', // ใส่รูป QR ของร้าน
};

export function CheckoutPage({ onBack, onOrderComplete }: CheckoutPageProps) {
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'promptpay'>('promptpay');
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSlipImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทร');
      return;
    }

    if (paymentMethod === 'promptpay' && !slipImage) {
      alert('กรุณาอัพโหลดสลิปการโอนเงิน');
      return;
    }

    setIsSubmitting(true);

    // TODO: ส่งข้อมูลไป API
    // สำหรับตอนนี้ใช้ mock
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `TP${Date.now()}`;
    clearCart();
    onOrderComplete(orderId);
  };

  return (
    <div className="space-y-4 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-800">ยืนยันคำสั่งซื้อ</h2>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-slate-800">ข้อมูลลูกค้า</h3>

        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ชื่อ *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="relative">
          <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="tel"
            placeholder="เบอร์โทร *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Delivery Type */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-slate-800">วิธีรับอาหาร</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setForm({ ...form, deliveryType: 'pickup' })}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              form.deliveryType === 'pickup'
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xl">🏪</span>
            <p className="font-medium text-sm mt-1">รับเอง</p>
          </button>
          
          <button
            onClick={() => setForm({ ...form, deliveryType: 'delivery' })}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              form.deliveryType === 'delivery'
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xl">🛵</span>
            <p className="font-medium text-sm mt-1">จัดส่ง</p>
          </button>
        </div>

        {form.deliveryType === 'delivery' && (
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
            <textarea
              placeholder="ที่อยู่จัดส่ง *"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-slate-800">วิธีชำระเงิน</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('promptpay')}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              paymentMethod === 'promptpay'
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xl">📱</span>
            <p className="font-medium text-sm mt-1">PromptPay</p>
          </button>
          
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              paymentMethod === 'cash'
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-xl">💵</span>
            <p className="font-medium text-sm mt-1">เงินสด</p>
          </button>
        </div>

        {/* PromptPay Info */}
        {paymentMethod === 'promptpay' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            {/* QR Code */}
            <div className="bg-white rounded-lg p-4 flex justify-center">
              {BANK_INFO.qrCodeImage ? (
                <img
                  src={BANK_INFO.qrCodeImage}
                  alt="PromptPay QR"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                  QR Code
                </div>
              )}
            </div>

            {/* Bank Info */}
            <div className="text-center text-sm">
              <p className="text-blue-800 font-medium">{BANK_INFO.bankName}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="font-mono font-bold text-blue-900">{BANK_INFO.accountNumber}</span>
                <button onClick={copyAccountNumber} className="text-blue-600">
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-blue-700">{BANK_INFO.accountName}</p>
            </div>

            {/* Slip Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSlipUpload}
                className="hidden"
              />
              
              {slipImage ? (
                <div className="relative">
                  <img
                    src={slipImage}
                    alt="Slip"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSlipImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-medium flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  อัพโหลดสลิป
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3">สรุปคำสั่งซื้อ</h3>
        
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <span className="text-slate-600">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium">฿{item.product.price * item.quantity}</span>
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

      {/* Note */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <textarea
          placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={2}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 to-transparent">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-70 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              กำลังส่งคำสั่งซื้อ...
            </>
          ) : (
            <>ยืนยันสั่งซื้อ • ฿{total}</>
          )}
        </button>
      </div>
    </div>
  );
}

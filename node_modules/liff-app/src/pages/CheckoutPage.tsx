import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, User, Upload, CheckCircle, Copy, Store, Truck, Package } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useCustomerStore } from '../stores/customerStore';
import { DistanceChecker } from '../components/DistanceChecker';
import { DeliveryType } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

// ข้อมูลบัญชีร้าน
const BANK_INFO = {
  bankName: 'ธนาคารกสิกรไทย สาขาอ่างทอง',
  accountNumber: '205-1-21824-0',
  accountName: 'คุณ ธัญทิพย์ วิชยเจริญพงษ์',
  qrCodeImage: '/images/qr-payment.png',
};

const DELIVERY_OPTIONS = [
  {
    id: 'pickup' as DeliveryType,
    icon: Store,
    title: 'รับที่ร้าน',
    description: 'เดินทางมารับเอง',
    price: 'ฟรี',
    color: 'green',
  },
  {
    id: 'free-delivery' as DeliveryType,
    icon: Truck,
    title: 'ส่งฟรีโดยร้าน',
    description: 'ภายในรัศมี 2 กม.',
    price: 'ฟรี',
    color: 'blue',
  },
  {
    id: 'easy-delivery' as DeliveryType,
    icon: Package,
    title: 'Easy Delivery',
    description: 'จ่ายค่าส่งกับไรเดอร์',
    price: 'เกิน 2 กม.',
    color: 'amber',
  },
];

export function CheckoutPage({ onBack, onOrderComplete }: CheckoutPageProps) {
  const { getTotal, clearCart, getGroupedItems } = useCartStore();
  const { info: savedCustomer } = useCustomerStore();
  const total = getTotal();
  const groupedItems = getGroupedItems();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    deliveryType: 'pickup' as DeliveryType,
    address: '',
    landmark: '',
  });

  // Pre-fill from saved customer info
  useEffect(() => {
    if (savedCustomer.phone || savedCustomer.address) {
      setForm((prev) => ({
        ...prev,
        phone: savedCustomer.phone || prev.phone,
        address: savedCustomer.address || prev.address,
        landmark: savedCustomer.landmark || prev.landmark,
      }));
    }
  }, [savedCustomer]);

  const [distanceKm, setDistanceKm] = useState<number | null>(null);
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

  const handleDistanceChecked = (result: { distance: number; isFreeDelivery: boolean }) => {
    setDistanceKm(result.distance);
    // Auto-select delivery type based on distance
    if (result.isFreeDelivery) {
      setForm({ ...form, deliveryType: 'free-delivery' });
    } else {
      setForm({ ...form, deliveryType: 'easy-delivery' });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทร');
      return;
    }

    if (form.deliveryType !== 'pickup' && !form.address) {
      alert('กรุณากรอกที่อยู่จัดส่ง');
      return;
    }

    if (paymentMethod === 'promptpay' && !slipImage) {
      alert('กรุณาอัพโหลดสลิปการโอนเงิน');
      return;
    }

    setIsSubmitting(true);

    // TODO: ส่งข้อมูลไป API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `TP${Date.now()}`;
    clearCart();
    onOrderComplete(orderId);
  };

  const needsAddress = form.deliveryType !== 'pickup';

  return (
    <div className="space-y-4 pb-36">
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
            placeholder="ชื่อ-นามสกุล *"
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

      {/* Delivery Type - 3 Options */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="font-bold text-slate-800">วิธีรับอาหาร</h3>

        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = form.deliveryType === option.id;
            const colorClass = {
              green: isSelected ? 'border-green-500 bg-green-50' : 'border-slate-200',
              blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200',
              amber: isSelected ? 'border-amber-500 bg-amber-50' : 'border-slate-200',
            }[option.color];

            return (
              <button
                key={option.id}
                onClick={() => setForm({ ...form, deliveryType: option.id })}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${colorClass}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  option.color === 'green' ? 'bg-green-100' :
                  option.color === 'blue' ? 'bg-blue-100' : 'bg-amber-100'
                }`}>
                  <Icon size={20} className={
                    option.color === 'green' ? 'text-green-600' :
                    option.color === 'blue' ? 'text-blue-600' : 'text-amber-600'
                  } />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                    {option.title}
                  </p>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  option.color === 'green' ? 'bg-green-100 text-green-700' :
                  option.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {option.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Distance Checker - for delivery */}
        {needsAddress && (
          <div className="pt-2 border-t border-slate-100">
            <DistanceChecker onDistanceChecked={handleDistanceChecked} />
          </div>
        )}

        {/* Address & Landmark - for delivery */}
        {needsAddress && (
          <div className="space-y-3 pt-2">
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
            
            <input
              type="text"
              placeholder="จุดสังเกต เช่น ติดกับเซเว่น, ตรงข้าม 7-11"
              value={form.landmark}
              onChange={(e) => setForm({ ...form, landmark: e.target.value })}
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          {groupedItems.map((group) => (
            <div key={group.product.id}>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {group.product.name} x{group.items.length}
                </span>
                <span className="font-medium">฿{group.product.price * group.items.length}</span>
              </div>
              {/* แสดง notes ถ้ามี */}
              {group.items.some(item => item.note) && (
                <div className="ml-4 text-xs text-amber-600">
                  {group.items.map((item, i) => 
                    item.note && (
                      <p key={item.id}>• จานที่ {i + 1}: {item.note}</p>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-800">รวมค่าอาหาร</span>
            <span className="text-2xl font-bold text-brand-700">฿{total}</span>
          </div>
          {form.deliveryType === 'easy-delivery' && (
            <p className="text-xs text-amber-600 mt-1">
              * ค่าส่ง Easy Delivery ชำระกับไรเดอร์ปลายทาง
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 to-transparent">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 disabled:opacity-70 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2"
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

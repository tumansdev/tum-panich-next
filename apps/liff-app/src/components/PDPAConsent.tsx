import { Shield, Check, X, FileText, Phone, MapPin, User, History, Lock } from 'lucide-react';
import { closeLiff } from '../lib/liff';

interface PDPAConsentProps {
  onAccept: () => void;
  onViewPolicy: () => void;
}

export function PDPAConsent({ onAccept, onViewPolicy }: PDPAConsentProps) {
  const handleReject = () => {
    // ปิด LIFF เมื่อปฏิเสธ
    closeLiff();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 rounded-t-3xl sm:rounded-t-3xl">
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">นโยบายความเป็นส่วนตัว</h2>
              <p className="text-brand-100 text-sm">PDPA Compliance</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            ร้าน<span className="font-bold text-brand-700">ตั้มพานิช</span> มีความจำเป็นต้องเก็บข้อมูลของท่านเพื่อให้บริการสั่งอาหาร
          </p>

          {/* Data we collect */}
          <div className="space-y-2">
            <p className="font-bold text-slate-800 text-sm">ข้อมูลที่เก็บ:</p>
            <div className="grid grid-cols-2 gap-2">
              <DataItem icon={<User size={14} />} text="ชื่อ-นามสกุล" />
              <DataItem icon={<Phone size={14} />} text="เบอร์โทรศัพท์" />
              <DataItem icon={<MapPin size={14} />} text="ที่อยู่จัดส่ง" />
              <DataItem icon={<Lock size={14} />} text="LINE Profile" />
              <DataItem icon={<History size={14} />} text="ประวัติการสั่ง" />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <p className="font-bold text-slate-800 text-sm">วัตถุประสงค์:</p>
            <ul className="text-slate-600 text-sm space-y-1">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                ดำเนินการสั่งอาหารและจัดส่ง
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                ติดต่อเรื่องคำสั่งซื้อ
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                ปรับปรุงบริการให้ดียิ่งขึ้น
              </li>
            </ul>
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-amber-800 text-xs">
              ⚠️ หากท่านไม่ยอมรับ จะไม่สามารถใช้บริการสั่งอาหารได้
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          {/* Read more */}
          <button
            onClick={onViewPolicy}
            className="w-full flex items-center justify-center gap-2 py-3 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors text-sm font-medium"
          >
            <FileText size={16} />
            อ่านนโยบายฉบับเต็ม
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all"
          >
            <Check size={20} />
            ยอมรับและใช้งานต่อ
          </button>

          {/* Reject */}
          <button
            onClick={handleReject}
            className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors text-sm"
          >
            <X size={16} />
            ปฏิเสธและปิดแอป
          </button>
        </div>
      </div>
    </div>
  );
}

function DataItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 text-xs bg-slate-50 rounded-lg p-2">
      <span className="text-slate-400">{icon}</span>
      {text}
    </div>
  );
}

import { useState } from 'react';
import { Phone, MapPin, Edit2, Check, User } from 'lucide-react';
import { LiffProfile } from '../types';
import { useCustomerStore } from '../stores/customerStore';

interface ProfilePageProps {
  profile: LiffProfile | null;
}

export function ProfilePage({ profile }: ProfilePageProps) {
  const { info, updateInfo } = useCustomerStore();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempPhone, setTempPhone] = useState(info.phone);
  const [tempAddress, setTempAddress] = useState(info.address);
  const [tempLandmark, setTempLandmark] = useState(info.landmark);

  const savePhone = () => {
    updateInfo({ phone: tempPhone });
    setIsEditingPhone(false);
  };

  const saveAddress = () => {
    updateInfo({ address: tempAddress, landmark: tempLandmark });
    setIsEditingAddress(false);
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          {profile?.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User size={40} className="text-white/80" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">
              {profile?.displayName || 'ผู้ใช้งาน'}
            </h2>
            {profile?.statusMessage && (
              <p className="text-white/80 text-sm">{profile.statusMessage}</p>
            )}
            <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full mt-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              เข้าสู่ระบบผ่าน LINE
            </span>
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Phone size={18} className="text-brand-600" />
            เบอร์โทรศัพท์
          </h3>
          {!isEditingPhone && (
            <button
              onClick={() => {
                setTempPhone(info.phone);
                setIsEditingPhone(true);
              }}
              className="text-brand-600 text-sm font-medium flex items-center gap-1"
            >
              <Edit2 size={14} />
              แก้ไข
            </button>
          )}
        </div>

        {isEditingPhone ? (
          <div className="flex gap-2">
            <input
              type="tel"
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
              placeholder="กรอกเบอร์โทร"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={savePhone}
              className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <p className={`text-lg ${info.phone ? 'text-slate-800' : 'text-slate-400'}`}>
            {info.phone || 'ยังไม่ได้ระบุเบอร์โทร'}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <MapPin size={18} className="text-brand-600" />
            ที่อยู่จัดส่ง
          </h3>
          {!isEditingAddress && (
            <button
              onClick={() => {
                setTempAddress(info.address);
                setTempLandmark(info.landmark);
                setIsEditingAddress(true);
              }}
              className="text-brand-600 text-sm font-medium flex items-center gap-1"
            >
              <Edit2 size={14} />
              แก้ไข
            </button>
          )}
        </div>

        {isEditingAddress ? (
          <div className="space-y-3">
            <textarea
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              placeholder="กรอกที่อยู่จัดส่ง"
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <input
              type="text"
              value={tempLandmark}
              onChange={(e) => setTempLandmark(e.target.value)}
              placeholder="จุดสังเกต เช่น ติดกับเซเว่น"
              className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={saveAddress}
              className="w-full py-3 bg-brand-600 text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <Check size={18} />
              บันทึกที่อยู่
            </button>
          </div>
        ) : (
          <div>
            {info.address ? (
              <div className="space-y-1">
                <p className="text-slate-800">{info.address}</p>
                {info.landmark && (
                  <p className="text-sm text-amber-600">📍 {info.landmark}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400">ยังไม่ได้ระบุที่อยู่</p>
            )}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>เคล็ดลับ:</strong> บันทึกข้อมูลไว้ที่นี่ เวลาสั่งอาหารจะได้ไม่ต้องกรอกใหม่ทุกครั้ง!
        </p>
      </div>
    </div>
  );
}

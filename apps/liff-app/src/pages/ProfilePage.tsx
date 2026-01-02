import { useState } from 'react';
import { Phone, MapPin, Edit2, Check, User, MessageCircle, HelpCircle, Heart, ChevronRight } from 'lucide-react';
import { LiffProfile } from '../types';
import { useCustomerStore } from '../stores/customerStore';
import { useFavoritesStore } from '../stores/favoritesStore';

interface ProfilePageProps {
  profile: LiffProfile | null;
  onShowFavorites?: () => void;
}

export function ProfilePage({ profile, onShowFavorites }: ProfilePageProps) {
  const { info, updateInfo } = useCustomerStore();
  const favoritesCount = useFavoritesStore((s) => s.favorites.length);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempName, setTempName] = useState(info.name);
  const [tempPhone, setTempPhone] = useState(info.phone);
  const [tempAddress, setTempAddress] = useState(info.address);
  const [tempLandmark, setTempLandmark] = useState(info.landmark);
  const [showHelp, setShowHelp] = useState(false);

  const saveName = () => {
    updateInfo({ name: tempName });
    setIsEditingName(false);
  };

  const savePhone = () => {
    updateInfo({ phone: tempPhone });
    setIsEditingPhone(false);
  };

  const saveAddress = () => {
    updateInfo({ address: tempAddress, landmark: tempLandmark });
    setIsEditingAddress(false);
  };

  return (
    <div className="space-y-5 pt-4">
      {/* ===== HERO PROFILE SECTION ===== */}
      <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-3xl p-6 text-white shadow-2xl overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Profile Picture */}
          <div className="relative mb-4">
            {profile?.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full border-4 border-white/40 shadow-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <User size={48} className="text-white/80" />
              </div>
            )}
            {/* Online Badge */}
            {profile && (
              <span className="absolute -bottom-1 right-0 w-6 h-6 bg-green-400 rounded-full border-4 border-brand-700 shadow-lg"></span>
            )}
          </div>

          {/* Name & Status */}
          <h2 className="text-2xl font-bold mb-1">
            {profile?.displayName || 'ผู้ใช้งาน'}
          </h2>
          {profile?.statusMessage && (
            <p className="text-white/70 text-sm mb-3 max-w-xs">{profile.statusMessage}</p>
          )}
          {profile && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              เชื่อมต่อ LINE แล้ว
            </span>
          )}
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => onShowFavorites?.()}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-all active:scale-95 relative"
        >
          {favoritesCount > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-2">
            <Heart size={20} className="text-brand-600" fill={favoritesCount > 0 ? 'currentColor' : 'none'} />
          </div>
          <span className="text-xs font-medium text-slate-700">รายการโปรด</span>
        </button>
        <button 
          onClick={() => {
            // Open LINE OA @tumpanich
            window.open('https://line.me/R/ti/p/@tumpanich', '_blank');
          }}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
            <MessageCircle size={20} className="text-blue-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">ติดต่อเรา</span>
        </button>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
            <HelpCircle size={20} className="text-amber-600" />
          </div>
          <span className="text-xs font-medium text-slate-700">ช่วยเหลือ</span>
        </button>
      </div>

      {/* ===== HELP FAQ SECTION ===== */}
      {showHelp && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-500" />
              คำถามที่พบบ่อย
            </h3>
            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
              <ChevronRight size={20} className="rotate-90" />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <FAQItem 
              q="สั่งอาหารอย่างไร?" 
              a="กดเมนูที่ต้องการ → เพิ่มลงตะกร้า → ไปหน้าชำระเงิน → กรอกข้อมูล → โอนเงิน → อัพโหลดสลิป" 
            />
            <FAQItem 
              q="ร้านเปิดกี่โมง?" 
              a="จันทร์-เสาร์ 10:00-14:00 น. (อาทิตย์หยุด)" 
            />
            <FAQItem 
              q="ส่งฟรีหรือเปล่า?" 
              a="ส่งฟรีภายในรัศมี 2 กม. จากร้าน หากเกิน 2 กม. จะคิดค่าส่งตามจริงกับไรเดอร์" 
            />
            <FAQItem 
              q="ติดต่อร้านได้ที่ไหน?" 
              a="โทร 084-115-8342 หรือ LINE OA @tumpanich" 
            />
          </div>
        </div>
      )}

      {/* ===== MY INFORMATION SECTION ===== */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">ข้อมูลของฉัน</h3>

        {/* Name Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                <User size={16} className="text-brand-600" />
              </div>
              <span className="font-medium text-slate-700">ชื่อ-นามสกุล</span>
            </div>
            {!isEditingName && (
              <button
                onClick={() => { setTempName(info.name); setIsEditingName(true); }}
                className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <Edit2 size={14} />
                แก้ไข
              </button>
            )}
          </div>
          {isEditingName ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button onClick={saveName} className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <p className={`text-lg ${info.name ? 'text-slate-800' : 'text-slate-400 italic'}`}>
              {info.name || 'ยังไม่ได้ระบุ'}
            </p>
          )}
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone size={16} className="text-green-600" />
              </div>
              <span className="font-medium text-slate-700">เบอร์โทรศัพท์</span>
            </div>
            {!isEditingPhone && (
              <button
                onClick={() => { setTempPhone(info.phone); setIsEditingPhone(true); }}
                className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <Edit2 size={14} />
                แก้ไข
              </button>
            )}
          </div>
          {isEditingPhone ? (
            <div className="flex gap-2 mt-2">
              <input
                type="tel"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="กรอกเบอร์โทร"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button onClick={savePhone} className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Check size={20} />
              </button>
            </div>
          ) : (
            <p className={`text-lg ${info.phone ? 'text-slate-800' : 'text-slate-400 italic'}`}>
              {info.phone || 'ยังไม่ได้ระบุ'}
            </p>
          )}
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-amber-600" />
              </div>
              <span className="font-medium text-slate-700">ที่อยู่จัดส่ง</span>
            </div>
            {!isEditingAddress && (
              <button
                onClick={() => { setTempAddress(info.address); setTempLandmark(info.landmark); setIsEditingAddress(true); }}
                className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:underline"
              >
                <Edit2 size={14} />
                แก้ไข
              </button>
            )}
          </div>
          {isEditingAddress ? (
            <div className="space-y-3 mt-2">
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
                className="w-full py-3 bg-brand-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-md"
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
                    <p className="text-sm text-amber-600 font-medium">📍 {info.landmark}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 italic">ยังไม่ได้ระบุ</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== APP INFO ===== */}
      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          ตั้มพานิช LIFF App v1.0.0 🍜
        </p>
      </div>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-left"
      >
        <span className="font-medium text-slate-700">{q}</span>
        <ChevronRight size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <p className="text-slate-500 pl-2 pb-2 text-xs leading-relaxed">{a}</p>
      )}
    </div>
  );
}

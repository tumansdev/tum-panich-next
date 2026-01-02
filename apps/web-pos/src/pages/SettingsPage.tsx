/// <reference types="vite/client" />
import { useState, useEffect } from 'react';
import { Store, RefreshCw, Save, Power, Clock, MessageSquare, Edit2, Megaphone, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

interface StoreStatus {
  isOpen: boolean;
  message: string;
  closeTime: string | null;
}

interface StoreHours {
  weekday: { open: string; close: string };
  sunday: string;
}

interface SpecialMenu {
  active: boolean;
  title: string;
  description: string;
  emoji: string;
}

export function SettingsPage() {
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({ isOpen: true, message: '', closeTime: null });
  const [storeHours, setStoreHours] = useState<StoreHours>({
    weekday: { open: '10:00', close: '14:00' },
    sunday: 'ปิด'
  });
  const [specialMenu, setSpecialMenu] = useState<SpecialMenu>({
    active: false,
    title: '',
    description: '',
    emoji: '🍜'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closeMessage, setCloseMessage] = useState('');
  const [editingHours, setEditingHours] = useState(false);
  const [earlyCloseTime, setEarlyCloseTime] = useState('');

  // Fetch store status on mount
  useEffect(() => {
    fetchStoreStatus();
    fetchSpecialMenu();
  }, []);

  const fetchStoreStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/store/status`);
      const data = await response.json();
      setStoreStatus(data);
      setCloseMessage(data.message || '');
      if (data.hours) {
        setStoreHours(data.hours);
      }
    } catch (error) {
      console.error('Failed to fetch store status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/api/store/special-menu`);
      const data = await response.json();
      setSpecialMenu(data);
    } catch (error) {
      console.error('Failed to fetch special menu:', error);
    }
  };

  const toggleStore = async () => {
    setSaving(true);
    const newStatus = !storeStatus.isOpen;
    const message = newStatus ? '' : closeMessage;

    try {
      const response = await fetch(`${API_URL}/api/store/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: newStatus, message, closeTime: newStatus ? null : earlyCloseTime || null }),
      });

      if (response.ok) {
        setStoreStatus({ isOpen: newStatus, message, closeTime: newStatus ? null : earlyCloseTime || null });
      }
    } catch (error) {
      console.error('Failed to update store status:', error);
    } finally {
      setSaving(false);
    }
  };

  const setEarlyClose = async () => {
    if (!earlyCloseTime) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/store/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isOpen: true, 
          message: storeStatus.message, 
          closeTime: earlyCloseTime 
        }),
      });

      if (response.ok) {
        setStoreStatus(prev => ({ ...prev, closeTime: earlyCloseTime }));
        setEarlyCloseTime('');
      }
    } catch (error) {
      console.error('Failed to set early close:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveMessage = async () => {
    if (storeStatus.isOpen) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/store/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: storeStatus.isOpen, message: closeMessage, closeTime: storeStatus.closeTime }),
      });

      if (response.ok) {
        setStoreStatus(prev => ({ ...prev, message: closeMessage }));
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveHours = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/store/hours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeHours),
      });
      setEditingHours(false);
    } catch (error) {
      console.error('Failed to save hours:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveSpecialMenu = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/api/store/special-menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specialMenu),
      });
    } catch (error) {
      console.error('Failed to save special menu:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">ตั้งค่า</h2>
        <p className="text-slate-500">จัดการร้านและระบบ</p>
      </div>

      {/* Store Status Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${storeStatus.isOpen ? 'bg-green-100' : 'bg-red-100'}`}>
              <Store size={24} className={storeStatus.isOpen ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">สถานะร้าน</h3>
              <p className="text-sm text-slate-500">เปิด/ปิดรับออเดอร์จากลูกค้า</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Power size={20} className="text-slate-400" />
              <span className="font-medium text-slate-700">สถานะปัจจุบัน</span>
            </div>
            <button
              onClick={toggleStore}
              disabled={saving}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                storeStatus.isOpen 
                  ? 'bg-green-500 focus:ring-green-500' 
                  : 'bg-red-500 focus:ring-red-500'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                  storeStatus.isOpen ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
              <span className={`absolute text-white font-bold text-sm ${storeStatus.isOpen ? 'left-3' : 'right-3'}`}>
                {storeStatus.isOpen ? 'เปิด' : 'ปิด'}
              </span>
            </button>
          </div>

          {/* Status Display */}
          <div className={`flex items-center gap-3 p-4 rounded-xl ${storeStatus.isOpen ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`w-3 h-3 rounded-full ${storeStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`font-medium ${storeStatus.isOpen ? 'text-green-700' : 'text-red-700'}`}>
              {storeStatus.isOpen ? '🟢 ร้านเปิดรับออเดอร์' : '🔴 ร้านปิดชั่วคราว'}
              {storeStatus.closeTime && storeStatus.isOpen && (
                <span className="text-amber-600 ml-2">(ปิดเวลา {storeStatus.closeTime})</span>
              )}
            </span>
          </div>

          {/* Early Close (when open) */}
          {storeStatus.isOpen && (
            <div className="space-y-3 p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-600" />
                <label className="font-medium text-amber-800">ปิดร้านก่อนเวลา</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={earlyCloseTime}
                  onChange={(e) => setEarlyCloseTime(e.target.value)}
                  className="flex-1 p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={setEarlyClose}
                  disabled={!earlyCloseTime || saving}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  ตั้งเวลาปิด
                </button>
              </div>
              <p className="text-xs text-amber-600">ลูกค้าจะเห็นเวลานับถอยหลังก่อนร้านปิด</p>
            </div>
          )}

          {/* Close Message */}
          {!storeStatus.isOpen && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-slate-400" />
                <label className="font-medium text-slate-700">ข้อความแจ้งลูกค้า</label>
              </div>
              <textarea
                value={closeMessage}
                onChange={(e) => setCloseMessage(e.target.value)}
                placeholder="เช่น ร้านปิดวันนี้เนื่องจากวันหยุด กลับมาพบกันพรุ่งนี้ครับ"
                className="w-full p-4 border border-slate-200 rounded-xl resize-none h-24 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <button
                onClick={saveMessage}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                บันทึกข้อความ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Special Menu Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-100">
              <Megaphone size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">เมนูพิเศษวันนี้</h3>
              <p className="text-sm text-slate-500">โฆษณาแสดง 3 วินาที เมื่อลูกค้าเข้าแอป</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Toggle Active */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-slate-400" />
              <span className="font-medium text-slate-700">เปิดใช้งาน</span>
            </div>
            <button
              onClick={() => setSpecialMenu(prev => ({ ...prev, active: !prev.active }))}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                specialMenu.active ? 'bg-purple-500' : 'bg-slate-300'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                specialMenu.active ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {specialMenu.active && (
            <>
              {/* Emoji */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Emoji</label>
                <input
                  type="text"
                  value={specialMenu.emoji}
                  onChange={(e) => setSpecialMenu(prev => ({ ...prev, emoji: e.target.value }))}
                  placeholder="🍜"
                  className="w-20 p-3 text-2xl text-center border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อเมนู</label>
                <input
                  type="text"
                  value={specialMenu.title}
                  onChange={(e) => setSpecialMenu(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ก๋วยเตี๋ยวไก่ตุ๋น"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">รายละเอียด</label>
                <textarea
                  value={specialMenu.description}
                  onChange={(e) => setSpecialMenu(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="วันนี้มีเมนูพิเศษ!"
                  className="w-full p-3 border border-slate-200 rounded-xl resize-none h-20 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl text-center">
                <p className="text-xs text-slate-500 mb-2">ตัวอย่าง</p>
                <div className="text-4xl mb-2">{specialMenu.emoji || '🍜'}</div>
                <p className="font-bold text-slate-800">{specialMenu.title || 'ชื่อเมนู'}</p>
                <p className="text-sm text-slate-600">{specialMenu.description || 'รายละเอียด'}</p>
              </div>
            </>
          )}

          <button
            onClick={saveSpecialMenu}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            บันทึกเมนูพิเศษ
          </button>
        </div>
      </div>

      {/* Store Hours Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100">
                <Clock size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">เวลาทำการ</h3>
                <p className="text-sm text-slate-500">เวลาเปิด-ปิดร้าน</p>
              </div>
            </div>
            <button
              onClick={() => setEditingHours(!editingHours)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Edit2 size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {editingHours ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">จันทร์ - เสาร์</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={storeHours.weekday.open}
                    onChange={(e) => setStoreHours(prev => ({
                      ...prev,
                      weekday: { ...prev.weekday, open: e.target.value }
                    }))}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="time"
                    value={storeHours.weekday.close}
                    onChange={(e) => setStoreHours(prev => ({
                      ...prev,
                      weekday: { ...prev.weekday, close: e.target.value }
                    }))}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">วันอาทิตย์</label>
                <input
                  type="text"
                  value={storeHours.sunday}
                  onChange={(e) => setStoreHours(prev => ({ ...prev, sunday: e.target.value }))}
                  placeholder="ปิด หรือ เวลาเปิด-ปิด"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                onClick={saveHours}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                บันทึกเวลา
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-slate-500 mb-1">จันทร์ - เสาร์</p>
                <p className="font-bold text-slate-800">{storeHours.weekday.open} - {storeHours.weekday.close}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-slate-500 mb-1">อาทิตย์</p>
                <p className="font-bold text-red-600">{storeHours.sunday}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-slate-400 py-4">
        Tum Panich Admin v1.1.0
      </div>
    </div>
  );
}

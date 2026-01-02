import { useState, useEffect } from 'react';
import { Store, RefreshCw, Save, Power, Clock, MessageSquare } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tumpanich.com';

interface StoreStatus {
  isOpen: boolean;
  message: string;
}

export function SettingsPage() {
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({ isOpen: true, message: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [closeMessage, setCloseMessage] = useState('');

  // Fetch store status on mount
  useEffect(() => {
    fetchStoreStatus();
  }, []);

  const fetchStoreStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/store/status`);
      const data = await response.json();
      setStoreStatus(data);
      setCloseMessage(data.message || '');
    } catch (error) {
      console.error('Failed to fetch store status:', error);
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ isOpen: newStatus, message }),
      });

      if (response.ok) {
        setStoreStatus({ isOpen: newStatus, message });
      }
    } catch (error) {
      console.error('Failed to update store status:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveMessage = async () => {
    if (storeStatus.isOpen) return; // Only save message when store is closed
    
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/store/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: storeStatus.isOpen, message: closeMessage }),
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
            </span>
          </div>

          {/* Close Message (only when closed) */}
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

      {/* Store Hours Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">เวลาทำการ</h3>
              <p className="text-sm text-slate-500">เวลาเปิด-ปิดร้าน</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-slate-500 mb-1">จันทร์ - เสาร์</p>
              <p className="font-bold text-slate-800">08:00 - 14:00</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-slate-500 mb-1">อาทิตย์</p>
              <p className="font-bold text-red-600">ปิด</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">* แก้ไขเวลาทำการใน Database</p>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-slate-400 py-4">
        Tum Panich Admin v1.0.0
      </div>
    </div>
  );
}

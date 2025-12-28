import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (pin.length < 4) {
      setError('กรุณากรอก PIN 4 หลัก');
      return;
    }

    const success = login(pin);
    if (!success) {
      setError('PIN ไม่ถูกต้อง');
      setPin('');
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-brand-600 to-amber-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={40} className="text-brand-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 mt-1">ร้าน ตั้มพานิช</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              รหัส PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={handlePinChange}
                placeholder="กรอก PIN 4-6 หลัก"
                className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          PIN เริ่มต้น: 1234
        </p>
      </div>
    </div>
  );
}

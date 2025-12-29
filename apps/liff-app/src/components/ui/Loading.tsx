import { useEffect, useState } from 'react';

export function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-w-[200px] animate-scale-in">
        <div className="w-16 h-16 relative mb-4">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">🍜</span>
          </div>
        </div>
        <h3 className="font-bold text-slate-800 text-lg">กำลังโหลด{dots}</h3>
        <p className="text-slate-500 text-sm">โปรดรอสักครู่น้าา...</p>
      </div>
    </div>
  );
}

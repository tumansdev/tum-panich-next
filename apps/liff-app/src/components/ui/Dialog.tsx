import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export type DialogType = 'success' | 'error' | 'warning' | 'info';

interface DialogProps {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function Dialog({ 
  isOpen, 
  type, 
  title, 
  message, 
  confirmText = 'ตกลง', 
  onConfirm,
  onCancel,
  showCancel = false
}: DialogProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300); // Wait for animation
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const config = {
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    warning: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' }
  };

  const { icon: Icon, color, bg } = config[type];

  return (
    <div 
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'bg-black/50 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Icon */}
        <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow`}>
          <Icon size={32} className={color} />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {showCancel && onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              ยกเลิก
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
              type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
              type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' :
              'bg-brand-600 hover:bg-brand-700 shadow-brand-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

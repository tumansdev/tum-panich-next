import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface SpecialPopupProps {
  title: string;
  description: string;
  emoji?: string;
  duration?: number; // milliseconds
  onClose?: () => void;
}

export function SpecialPopup({ 
  title, 
  description, 
  emoji = '🍜', 
  duration = 3000,
  onClose 
}: SpecialPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / (duration / 100))));
    }, 100);

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
      />
      
      {/* Popup */}
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl shadow-2xl p-6 max-w-sm w-full transform animate-bounce-in">
        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Sparkles decoration */}
        <div className="absolute -top-3 -left-3">
          <Sparkles className="text-amber-400 animate-pulse" size={24} />
        </div>
        <div className="absolute -top-3 -right-3">
          <Sparkles className="text-orange-400 animate-pulse" size={24} />
        </div>

        {/* Content */}
        <div className="text-center">
          {/* Emoji */}
          <div className="text-6xl mb-4 animate-bounce">
            {emoji}
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full mb-3">
            <Sparkles size={12} />
            เมนูพิเศษวันนี้
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {title}
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-sm">
            {description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tap to dismiss hint */}
        <p className="text-center text-xs text-slate-400 mt-3">
          แตะเพื่อปิด
        </p>
      </div>
    </div>
  );
}

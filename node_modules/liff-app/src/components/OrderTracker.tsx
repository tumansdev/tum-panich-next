import { Check, Clock, Flame, Package, Truck, CheckCircle } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTrackerProps {
  currentStatus: OrderStatus;
}

const statusSteps = [
  { id: 'pending', label: 'รอยืนยัน', icon: Clock },
  { id: 'confirmed', label: 'ยืนยันแล้ว', icon: Check },
  { id: 'cooking', label: 'กำลังทำ', icon: Flame },
  { id: 'ready', label: 'พร้อมส่ง', icon: Package },
  { id: 'completed', label: 'เสร็จสิ้น', icon: CheckCircle },
];

export function OrderTracker({ currentStatus }: OrderTrackerProps) {
  const currentIndex = statusSteps.findIndex((step) => step.id === currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <div className="text-red-600 font-bold text-lg">❌ ออเดอร์ถูกยกเลิก</div>
        <p className="text-red-500 text-sm mt-1">กรุณาติดต่อร้านค้า</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-4">สถานะออเดอร์</h3>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200">
          <div
            className="h-full bg-brand-600 transition-all duration-500"
            style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                      : 'bg-slate-100 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-brand-100 animate-pulse' : ''}`}
                >
                  <Icon size={20} />
                </div>
                <span
                  className={`text-[10px] mt-2 text-center font-medium ${
                    isCompleted ? 'text-brand-700' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current status message */}
      <div className="mt-6 p-3 bg-brand-50 rounded-lg text-center">
        <p className="text-brand-700 font-medium">
          {currentStatus === 'pending' && '⏳ รอร้านยืนยันออเดอร์'}
          {currentStatus === 'confirmed' && '✅ ร้านยืนยันออเดอร์แล้ว'}
          {currentStatus === 'cooking' && '🔥 กำลังปรุงอาหาร'}
          {currentStatus === 'ready' && '📦 อาหารพร้อมแล้ว!'}
          {currentStatus === 'completed' && '🎉 ขอบคุณที่ใช้บริการ!'}
        </p>
      </div>
    </div>
  );
}

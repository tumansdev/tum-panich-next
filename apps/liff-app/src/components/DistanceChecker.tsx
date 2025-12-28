import { useState } from 'react';
import { Navigation, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';

// พิกัดร้าน
const STORE_LOCATION = {
  lat: 14.584142066784167,
  lng: 100.42882812383826,
  name: 'ร้าน ตั้มพานิช',
  mapUrl: 'https://maps.app.goo.gl/Gs4BZZ9BJDAA44LH9',
};

const FREE_DELIVERY_RADIUS_KM = 2;

interface DistanceResult {
  distance: number;
  isFreeDelivery: boolean;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

interface DistanceCheckerProps {
  onDistanceChecked?: (result: DistanceResult) => void;
}

export function DistanceChecker({ onDistanceChecked }: DistanceCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DistanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkDistance = async () => {
    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('เบราว์เซอร์ไม่รองรับ GPS');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        STORE_LOCATION.lat,
        STORE_LOCATION.lng
      );

      const distanceResult: DistanceResult = {
        distance: Math.round(distance * 100) / 100,
        isFreeDelivery: distance <= FREE_DELIVERY_RADIUS_KM,
      };

      setResult(distanceResult);
      onDistanceChecked?.(distanceResult);
    } catch (err: any) {
      if (err.code === 1) {
        setError('กรุณาอนุญาตการเข้าถึงตำแหน่ง GPS');
      } else if (err.code === 2) {
        setError('ไม่สามารถระบุตำแหน่งได้');
      } else if (err.code === 3) {
        setError('หมดเวลาในการค้นหาตำแหน่ง');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาด');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const openMap = () => {
    window.open(STORE_LOCATION.mapUrl, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Check Distance Button */}
      <button
        onClick={checkDistance}
        disabled={isChecking}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-70"
      >
        {isChecking ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            กำลังค้นหาตำแหน่ง...
          </>
        ) : (
          <>
            <Navigation size={20} className="animate-bounce" />
            📍 ตรวจสอบระยะทางจากร้าน
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-xl border-2 ${
            result.isFreeDelivery
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.isFreeDelivery ? (
              <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle size={24} className="text-amber-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-bold ${result.isFreeDelivery ? 'text-green-800' : 'text-amber-800'}`}>
                ระยะห่างจากร้าน: {result.distance} กม.
              </p>
              <p className={`text-sm mt-1 ${result.isFreeDelivery ? 'text-green-700' : 'text-amber-700'}`}>
                {result.isFreeDelivery ? (
                  '✅ อยู่ในรัศมี 2 กม. - ส่งฟรีโดยทางร้าน!'
                ) : (
                  '📦 เกินรัศมี 2 กม. - จัดส่งโดย Easy Delivery (จ่ายไรเดอร์ปลายทาง)'
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800">ไม่สามารถตรวจสอบได้</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Open Map Button */}
      <button
        onClick={openMap}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
      >
        <MapPin size={18} />
        ดูตำแหน่งร้านบน Google Maps
      </button>
    </div>
  );
}

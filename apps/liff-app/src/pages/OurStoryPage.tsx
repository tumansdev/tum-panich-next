import { Phone, Clock, Navigation, Heart, Quote } from 'lucide-react';
import { STORE_INFO } from '../config/storeInfo';

export function OurStoryPage() {
  const handleCall = () => {
    window.location.href = `tel:${STORE_INFO.phone}`;
  };

  const handleOpenMap = () => {
    window.open(STORE_INFO.mapUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Hero Section */}
      <div className="relative h-56 bg-gradient-to-br from-brand-800 via-brand-700 to-amber-700 rounded-3xl overflow-hidden shadow-xl">

        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
          <img src="/images/logo.png" alt="Logo" className="w-20 h-20 rounded-2xl shadow-2xl mb-3 border-2 border-white/20" />
          <h1 className="text-white text-2xl font-bold mb-1">ตั้มพานิช</h1>
          <p className="text-white/80 text-sm">紅紅火火 • หมูแดงนุ่ม น้ำซุปหอม</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -left-8 top-8 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      {/* Brand Story Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-brand-800 mb-1">
          จากวิกฤต... สู่ตำนานหมูแดงแห่งอ่างทอง
        </h2>
        <p className="text-sm text-slate-500">
          รสชาติแห่งการเริ่มต้นใหม่ ที่ใส่หัวใจลงไปในหมูแดงทุกชิ้น
        </p>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 relative">
        <Quote size={24} className="text-amber-300 absolute top-3 left-3" />
        <p className="text-amber-900 font-medium italic text-center px-4">
          "คนเราล้มได้... แต่ต้องลุกให้เป็น และต้องลุกให้ 'อร่อย' กว่าเดิม"
        </p>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <Heart size={20} className="text-brand-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2">ผมชื่อ 'ตั้ม' ครับ...</h3>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                ชีวิตผมผ่านสนามธุรกิจมาหลายรูปแบบ มีทั้งวันที่สมหวังและผิดหวัง สารภาพตามตรงว่าครั้งล่าสุด ทุกอย่างมัน "พังไม่เป็นท่า" จนผมต้องหอบความบอบช้ำถอยกลับมาตั้งหลักที่บ้านเกิดจังหวัดอ่างทอง เพื่อเริ่มต้นนับหนึ่งใหม่
              </p>
              <p>
                ในวันที่ท้อแท้จนแทบหมดไฟ สิ่งที่เยียวยาหัวใจผมได้กลับเป็นสิ่งที่เรียบง่ายที่สุด นั่นคือความทรงจำของ "เด็กชายที่รักการกินก๋วยเตี๋ยวป๊อกๆ"
              </p>
              <p>
                ผมหลงใหลในรสชาติของน้ำซุปและเส้นมาตั้งแต่เด็ก ความชอบนั้นผลักดันให้ผมลุกขึ้นมาเข้าครัว ลองผิดลองถูกอยู่ในพื้นที่สี่เหลี่ยมเล็กๆ ที่บ้าน
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Turning Point */}
      <div className="bg-gradient-to-br from-brand-50 to-amber-50 rounded-2xl p-5 border border-brand-100">
        <h3 className="font-bold text-brand-800 mb-2">🔄 จุดเปลี่ยนสำคัญ</h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          จุดเปลี่ยนสำคัญเกิดขึ้นในวันที่ผมตัดสินใจทำแจกเพื่อนบ้าน... เสียงตอบรับที่ได้กลับมาไม่ใช่แค่คำว่า "กินได้" แต่ทุกคนบอกเป็นเสียงเดียวกันว่า <strong>"ต้องทำอีกนะ"</strong>
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mt-2">
          โดยเฉพาะ <span className="text-brand-700 font-bold">"หมูแดง"</span> สูตรพิเศษที่ใครได้ทานต่างก็ติดใจในรสสัมผัสและกลิ่นหอมที่เป็นเอกลักษณ์
        </p>
      </div>

      {/* Birth of Tum Panich */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-2">🏪 กำเนิดร้าน "ตั้มพานิช"</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          วินาทีนั้น ผมตระหนักได้ทันทีว่า บางทีความสุขและความสำเร็จอาจไม่ได้วัดกันที่ธุรกิจใหญ่โตไกลตัว แต่อยู่ที่การได้ทำของอร่อยๆ ด้วยความตั้งใจ ให้คนทานแล้วมีรอยยิ้มกลับไป
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">
          ร้าน <span className="text-brand-700 font-bold">"ตั้มพานิช"</span> จึงถือกำเนิดขึ้น... ที่นี่ไม่ใช่แค่ร้านก๋วยเตี๋ยว แต่คือ "โอกาสครั้งที่สอง" ของชีวิตผม
        </p>
      </div>

      {/* Philosophy Section */}
      <div className="bg-gradient-to-br from-red-700 to-amber-600 rounded-2xl p-5 text-white shadow-xl">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          ☯️ ปรัชญาในชามก๋วยเตี๋ยว
        </h3>
        <div className="text-center py-4">
          <p className="text-3xl font-bold mb-2">紅紅火火</p>
          <p className="text-white/80 text-sm">(hóng hóng huǒ huǒ)</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">红</span>
            <div>
              <p className="font-bold">Hóng - สีแดง</p>
              <p className="text-white/80">สีแห่งความมงคล ความสุข และความมั่งคั่ง ซึ่งพ้องเสียงกับ "หมูแดง"</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">火</span>
            <div>
              <p className="font-bold">Huǒ - ไฟ</p>
              <p className="text-white/80">ตัวแทนของพลังงาน ความอบอุ่น และความรุ่งโรจน์ดั่งเปลวไฟ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invitation */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
        <h3 className="font-bold text-amber-800 mb-2">🙏 แวะมาให้กำลังใจกันได้นะครับ</h3>
        <p className="text-sm text-amber-700">
          หากเรื่องราวของผมพอจะเป็นแรงบันดาลใจให้ใครที่กำลังท้อแท้ได้บ้าง หรือหากคุณอยากลองชิม
          รสชาติของ "การเริ่มต้นใหม่" ที่ผมตั้งใจทำสุดฝีมือ
        </p>
        <p className="text-sm text-amber-800 font-bold mt-3">
          ทุกคำติชมคือกำลังใจสำคัญที่ทำให้ผมและร้านตั้มพานิชก้าวต่อไปได้ครับ ❤️
        </p>
      </div>

      {/* Tagline */}
      <div className="text-center py-2">
        <p className="text-brand-700 font-bold">
          "ตั้มพานิช... หมูแดงนุ่ม น้ำซุปหอม พร้อมเสิร์ฟความอร่อยแล้ววันนี้"
        </p>
      </div>

      {/* Store Info Card */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="text-xl">🏪</span>
            ข้อมูลร้าน
          </h3>
        </div>
        
        <div className="space-y-3">
          {/* เวลาเปิด-ปิด */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-xs">เวลาเปิดทำการ</p>
              <p className="font-medium text-slate-800">{STORE_INFO.hours}</p>
            </div>
          </div>

          {/* เบอร์โทร */}
          <button 
            onClick={handleCall}
            className="w-full flex items-center gap-3 text-sm p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-slate-500 text-xs">โทรสั่งอาหาร</p>
              <p className="font-medium text-blue-600">{STORE_INFO.phone}</p>
            </div>
            <span className="text-blue-500 text-xs font-medium">กดโทร →</span>
          </button>

          {/* แผนที่ */}
          <button 
            onClick={handleOpenMap}
            className="w-full flex items-center gap-3 text-sm p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center animate-bounce">
              <Navigation size={20} className="text-amber-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-slate-500 text-xs">ดูแผนที่ร้าน</p>
              <p className="font-medium text-amber-600">เปิด Google Maps</p>
            </div>
            <span className="text-amber-500 text-xs font-medium">กดดูแผนที่ →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

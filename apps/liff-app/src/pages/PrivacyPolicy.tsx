import { ArrowLeft, Shield, Phone, Mail, MapPin, Building } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  onAccept: () => void;
}

export function PrivacyPolicy({ onBack, onAccept }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-brand-600" />
          <h1 className="font-bold text-slate-800">นโยบายความเป็นส่วนตัว</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 pb-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">ร้านตั้มพานิช</h2>
          <p className="text-slate-500 text-sm">Privacy Policy / PDPA</p>
        </div>

        <Section title="1. ข้อมูลที่เราเก็บรวบรวม">
          <p>เราเก็บรวบรวมข้อมูลส่วนบุคคลดังต่อไปนี้:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>ข้อมูลตัวตน:</strong> ชื่อ-นามสกุล, รูปโปรไฟล์ LINE</li>
            <li><strong>ข้อมูลติดต่อ:</strong> เบอร์โทรศัพท์, ที่อยู่จัดส่ง</li>
            <li><strong>ข้อมูลการใช้งาน:</strong> ประวัติการสั่งซื้อ, รายการโปรด</li>
            <li><strong>ข้อมูลการชำระเงิน:</strong> หลักฐานการโอนเงิน (สลิป)</li>
          </ul>
        </Section>

        <Section title="2. วัตถุประสงค์ในการเก็บข้อมูล">
          <ul className="list-disc list-inside space-y-1">
            <li>เพื่อดำเนินการรับคำสั่งซื้อและจัดส่งอาหาร</li>
            <li>เพื่อยืนยันตัวตนผ่านบัญชี LINE</li>
            <li>เพื่อติดต่อกรณีมีปัญหาเกี่ยวกับคำสั่งซื้อ</li>
            <li>เพื่อแจ้งสถานะการจัดส่ง</li>
            <li>เพื่อปรับปรุงและพัฒนาบริการ</li>
          </ul>
        </Section>

        <Section title="3. การเปิดเผยข้อมูล">
          <p>เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก ยกเว้น:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>พนักงานส่งอาหาร (ชื่อ, ที่อยู่, เบอร์โทร)</li>
            <li>เพื่อปฏิบัติตามกฎหมาย</li>
          </ul>
        </Section>

        <Section title="4. ระยะเวลาการเก็บข้อมูล">
          <p>เราจะเก็บข้อมูลของท่านไว้ตราบเท่าที่จำเป็น หรือจนกว่าท่านจะขอให้ลบข้อมูล</p>
        </Section>

        <Section title="5. สิทธิ์ของท่าน">
          <p>ท่านมีสิทธิ์:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>ขอเข้าถึงและขอรับสำเนาข้อมูลของท่าน</li>
            <li>ขอแก้ไขข้อมูลให้ถูกต้อง</li>
            <li>ขอลบข้อมูลของท่าน</li>
            <li>ถอนความยินยอม</li>
          </ul>
        </Section>

        <Section title="6. การติดต่อ">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 mt-2">
            <ContactItem icon={<Building size={16} />} label="ร้าน" value="ตั้มพานิช" />
            <ContactItem icon={<Phone size={16} />} label="โทร" value="084-115-8342" />
            <ContactItem icon={<Mail size={16} />} label="Line OA" value="@tumpanich" />
            <ContactItem icon={<MapPin size={16} />} label="ที่อยู่" value="14/3 หมู่ 7 ต.ศาลาแดง อ.เมือง จ.อ่างทอง" />
          </div>
        </Section>

        <p className="text-xs text-slate-400 text-center">
          ปรับปรุงล่าสุด: มกราคม 2569
        </p>
      </div>

      {/* Fixed Accept Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={onAccept}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg transition-all"
        >
          ยอมรับนโยบายความเป็นส่วนตัว
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-400">{icon}</span>
      <span className="text-slate-500 w-12">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}

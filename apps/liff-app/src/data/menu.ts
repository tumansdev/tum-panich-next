import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 'rice', name: 'ข้าว', icon: '🍚' },
  { id: 'noodle', name: 'ก๋วยเตี๋ยว', icon: '🍜' },
  { id: 'drink', name: 'เครื่องดื่ม', icon: '🥤' },
  { id: 'special', name: 'เมนูพิเศษ', icon: '⭐' },
];

export const noodleOptions = {
  id: 'noodle-type',
  name: 'เลือกเส้น',
  choices: ['เส้นเล็ก', 'เส้นใหญ่', 'บะหมี่', 'วุ้นเส้น'],
  required: true,
};

export const menuItems: Product[] = [
  // ===== ประเภทข้าว =====
  {
    id: 'rice-1',
    name: 'ข้าวหมูแดงสันคอ',
    description: 'หมูแดงสันคอหั่นชิ้น ราดน้ำจิ้ม เสิร์ฟพร้อมข้าวสวยร้อน',
    price: 50,
    image: '/images/rice-red-pork.jpg',
    category: 'rice',
    available: true,
  },
  {
    id: 'rice-2',
    name: 'ข้าวหมูแดงสามชั้น',
    description: 'หมูสามชั้นชุบซอสหมูแดง เนื้อนุ่มมัน',
    price: 60,
    image: '/images/rice-belly.jpg',
    category: 'rice',
    available: true,
  },
  {
    id: 'rice-3',
    name: 'ข้าวหมูกรอบ',
    description: 'หมูกรอบทอดกรอบนอกนุ่มใน ราดน้ำจิ้ม',
    price: 60,
    image: '/images/rice-crispy.jpg',
    category: 'rice',
    available: true,
  },
  {
    id: 'rice-4',
    name: 'ข้าวหมูแดงสันคอ + หมูกรอบ',
    description: 'รวมความอร่อย หมูแดงสันคอ + หมูกรอบ',
    price: 70,
    image: '/images/rice-combo1.jpg',
    category: 'rice',
    available: true,
  },
  {
    id: 'rice-5',
    name: 'ข้าวหมูแดงสามชั้น + หมูกรอบ',
    description: 'จัดเต็ม! หมูแดงสามชั้น + หมูกรอบ',
    price: 80,
    image: '/images/rice-combo2.jpg',
    category: 'rice',
    available: true,
  },

  // ===== ประเภทก๋วยเตี๋ยว =====
  {
    id: 'noodle-1',
    name: 'บะหมี่เกี๊ยวแห้งหมูแดง ไข่ยางมะตูม',
    description: 'บะหมี่เกี๊ยวหมูแดง เสิร์ฟพร้อมไข่ยางมะตูม',
    price: 50,
    image: '/images/noodle-egg.jpg',
    category: 'noodle',
    options: [noodleOptions],
    available: true,
  },
  {
    id: 'noodle-2',
    name: 'ก๋วยเตี๋ยวต้มยำ',
    description: 'ก๋วยเตี๋ยวน้ำต้มยำ รสจัดจ้าน',
    price: 40,
    image: '/images/noodle-tomyum.jpg',
    category: 'noodle',
    options: [noodleOptions],
    available: true,
  },
  {
    id: 'noodle-3',
    name: 'ก๋วยเตี๋ยวต้มจืด',
    description: 'ก๋วยเตี๋ยวน้ำใส รสกลมกล่อม',
    price: 40,
    image: '/images/noodle-clear.jpg',
    category: 'noodle',
    options: [noodleOptions],
    available: true,
  },
  {
    id: 'noodle-4',
    name: 'ก๋วยเตี๋ยวเย็นตาโฟ',
    description: 'ก๋วยเตี๋ยวน้ำแดงเย็นตาโฟ ใส่เต้าหู้ทอด',
    price: 45,
    image: '/images/noodle-yentafo.jpg',
    category: 'noodle',
    options: [noodleOptions],
    available: true,
  },

  // ===== ประเภทเครื่องดื่ม =====
  {
    id: 'drink-1',
    name: 'น้ำแข็ง',
    description: 'น้ำแข็งเปล่า',
    price: 0,
    image: '/images/ice.jpg',
    category: 'drink',
    available: true,
  },
  {
    id: 'drink-2',
    name: 'น้ำเปล่า',
    description: 'น้ำดื่มบรรจุขวด',
    price: 10,
    image: '/images/water.jpg',
    category: 'drink',
    available: true,
  },
  {
    id: 'drink-3',
    name: 'โค้กแช่เย็น',
    description: 'โค้กขวดแช่เย็น',
    price: 15,
    image: '/images/coke.jpg',
    category: 'drink',
    available: true,
  },
  {
    id: 'drink-4',
    name: 'โค้กแก้วโดม',
    description: 'โค้กใส่แก้วโดม ใส่น้ำแข็ง',
    price: 25,
    image: '/images/coke-dome.jpg',
    category: 'drink',
    available: true,
  },
  {
    id: 'drink-5',
    name: 'ชาไทยแบบขวด',
    description: 'ชาไทยหวานมัน บรรจุขวด',
    price: 30,
    image: '/images/thai-tea-bottle.jpg',
    category: 'drink',
    available: true,
  },
  {
    id: 'drink-6',
    name: 'ชาไทยใส่แก้ว',
    description: 'ชาไทยชงสด ใส่แก้วพร้อมน้ำแข็ง',
    price: 40,
    image: '/images/thai-tea-glass.jpg',
    category: 'drink',
    available: true,
  },
];

// เมนูพิเศษ - สามารถเพิ่มได้ทุกวัน
export const specialMenu: Product[] = [
  // ตัวอย่างเมนูพิเศษ - เพิ่มได้ตามต้องการ
  // {
  //   id: 'special-1',
  //   name: 'เมนูพิเศษวันนี้',
  //   description: 'อธิบายเมนู',
  //   price: 0,
  //   image: '/images/special.jpg',
  //   category: 'special',
  //   isSpecial: true,
  //   available: true,
  // },
];

export const getAllMenuItems = (): Product[] => {
  return [...menuItems, ...specialMenu.filter(item => item.available)];
};

export const getMenuByCategory = (categoryId: string): Product[] => {
  return getAllMenuItems().filter(item => item.category === categoryId);
};

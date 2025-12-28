import { useState } from 'react';
import { Plus, Edit2, Trash2, Image, Save, X, Search } from 'lucide-react';
import { MenuItem } from '../types';

// Mock menu items
const MOCK_MENU: MenuItem[] = [
  { id: 'rice-1', name: 'ข้าวหมูแดงสันคอ', price: 50, category: 'rice', available: true },
  { id: 'rice-2', name: 'ข้าวหมูกรอบ', price: 60, category: 'rice', available: true },
  { id: 'rice-3', name: 'ข้าวหมูแดงสามชั้น', price: 60, category: 'rice', available: true },
  { id: 'noodle-1', name: 'ก๋วยเตี๋ยวหมูแดง', price: 45, category: 'noodle', available: true },
  { id: 'noodle-2', name: 'ก๋วยเตี๋ยวหมูกรอบ', price: 50, category: 'noodle', available: true },
  { id: 'drink-1', name: 'น้ำเปล่า', price: 10, category: 'drink', available: true },
];

const CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'rice', name: 'ข้าว' },
  { id: 'noodle', name: 'ก๋วยเตี๋ยว' },
  { id: 'drink', name: 'เครื่องดื่ม' },
];

export function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>(MOCK_MENU);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'rice',
  });

  const filteredMenu = menu.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || item.category === category;
    return matchSearch && matchCategory;
  });

  const handleToggleAvailable = (id: string) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('ต้องการลบเมนูนี้?')) {
      setMenu((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      price: String(item.price),
      category: item.category,
    });
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;

    if (editingItem) {
      setMenu((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, name: form.name, price: Number(form.price), category: form.category }
            : item
        )
      );
      setEditingItem(null);
    } else {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: form.name,
        price: Number(form.price),
        category: form.category,
        available: true,
      };
      setMenu((prev) => [...prev, newItem]);
      setIsAdding(false);
    }

    setForm({ name: '', price: '', category: 'rice' });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
    setForm({ name: '', price: '', category: 'rice' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">จัดการเมนู</h2>
          <p className="text-slate-500">รวม {menu.length} รายการ</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
        >
          <Plus size={20} />
          เพิ่มเมนู
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                category === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingItem) && (
        <div className="bg-white rounded-xl p-6 border-2 border-brand-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-800 mb-4">
            {editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="ชื่อเมนู"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              type="number"
              placeholder="ราคา"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="rice">ข้าว</option>
              <option value="noodle">ก๋วยเตี๋ยว</option>
              <option value="drink">เครื่องดื่ม</option>
            </select>
            <div className="col-span-2 flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={18} />
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                <Save size={18} />
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">รูป</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">ชื่อเมนู</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">หมวดหมู่</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">ราคา</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">สถานะ</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMenu.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image size={20} />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">
                  {CATEGORIES.find((c) => c.id === item.category)?.name}
                </td>
                <td className="px-4 py-3 font-bold text-brand-700">฿{item.price}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleAvailable(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.available ? 'พร้อมขาย' : 'หมด'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

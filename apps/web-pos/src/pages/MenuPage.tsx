import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Image, Save, X, Search, Upload, RefreshCw, ToggleLeft, ToggleRight, FolderPlus } from 'lucide-react';
import { MenuItem } from '../types';
import { menuAPI, categoriesAPI } from '../lib/api';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

export function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Edit mode
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Category mode
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '', icon: '📦' });
  
  // Image upload
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    categoryId: 'rice',
    available: true,
  });

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuData, catData] = await Promise.all([
        menuAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      // Map API response
      const mapped = menuData.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        imageUrl: item.image_url,
        categoryId: item.category_id,
        available: item.available,
        isSpecial: item.is_special,
      }));
      setMenuItems(mapped);
      setCategories([{ id: 'all', name: 'ทั้งหมด' }, ...catData]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Toggle availability
  const handleToggle = async (id: string) => {
    try {
      const updated = await menuAPI.toggle(id);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, available: updated.available } : item))
      );
    } catch (error) {
      console.error('Failed to toggle:', error);
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบเมนูนี้?')) return;
    try {
      await menuAPI.delete(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Edit item
  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      categoryId: item.categoryId,
      available: item.available,
    });
    setPreviewImage(item.imageUrl || null);
    setImageFile(null);
    setIsCreating(false);
  };

  // Create new
  const handleCreate = () => {
    setEditItem(null);
    setFormData({
      id: `menu-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      categoryId: 'rice',
      available: true,
    });
    setPreviewImage(null);
    setImageFile(null);
    setIsCreating(true);
  };

  // Handle image selection in modal
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อเมนู');
      return;
    }

    setUploading(true);
    try {
      let savedItem: any;
      
      if (isCreating) {
        savedItem = await menuAPI.create({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category_id: formData.categoryId,
          available: formData.available,
        });
      } else if (editItem) {
        savedItem = await menuAPI.update(editItem.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category_id: formData.categoryId,
          available: formData.available,
        });
      }

      // Upload image if selected
      if (imageFile && savedItem) {
        const uploadResult = await menuAPI.uploadImage(savedItem.id, imageFile);
        savedItem = uploadResult.item;
      }

      // Update state
      if (isCreating) {
        setMenuItems((prev) => [...prev, {
          id: savedItem.id,
          name: savedItem.name,
          description: savedItem.description,
          price: parseFloat(savedItem.price),
          imageUrl: savedItem.image_url,
          categoryId: savedItem.category_id,
          available: savedItem.available,
        }]);
      } else {
        setMenuItems((prev) =>
          prev.map((item) => item.id === savedItem.id ? {
            ...item,
            name: savedItem.name,
            description: savedItem.description,
            price: parseFloat(savedItem.price),
            imageUrl: savedItem.image_url,
            categoryId: savedItem.category_id,
            available: savedItem.available,
          } : item)
        );
      }
      
      handleCancel();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('บันทึกไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditItem(null);
    setIsCreating(false);
    setPreviewImage(null);
    setImageFile(null);
  };

  // Add category
  const handleAddCategory = async () => {
    if (!newCategory.id.trim() || !newCategory.name.trim()) {
      alert('กรุณากรอกรหัสและชื่อหมวดหมู่');
      return;
    }
    
    try {
      const created = await categoriesAPI.create(newCategory);
      setCategories((prev) => [...prev, created]);
      setNewCategory({ id: '', name: '', icon: '📦' });
      setShowCategoryModal(false);
      alert('เพิ่มหมวดหมู่สำเร็จ!');
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('เพิ่มหมวดหมู่ไม่สำเร็จ');
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📋 จัดการเมนู</h1>
          <p className="text-sm text-slate-500">เพิ่ม แก้ไข ลบ เมนูอาหาร และหมวดหมู่</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            <FolderPlus size={20} />
            หมวดหมู่
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            <Plus size={20} />
            เพิ่มเมนู
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเมนู..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw size={32} className="animate-spin mx-auto text-brand-600" />
          <p className="mt-2 text-slate-500">กำลังโหลด...</p>
        </div>
      )}

      {/* Menu Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border ${
                item.available ? 'border-slate-200' : 'border-red-200 bg-red-50'
              } p-4 shadow-sm`}
            >
              {/* Image */}
              <div className="relative h-40 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <Image size={40} />
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="font-bold text-slate-800">{item.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
              <p className="text-lg font-bold text-brand-600 mt-1">฿{item.price}</p>

              {/* Actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`flex items-center gap-1 text-sm ${
                    item.available ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {item.available ? 'เปิดขาย' : 'ปิดขาย'}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-500">ไม่พบเมนู</p>
        </div>
      )}

      {/* Edit/Create Modal */}
      {(editItem || isCreating) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {isCreating ? '➕ เพิ่มเมนู' : '✏️ แก้ไขเมนู'}
              </h2>
              <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload in Modal */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">รูปภาพ</label>
                <div className="relative h-40 bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Image size={40} />
                      <p className="text-sm mt-2">คลิกเพื่อเลือกรูป</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {previewImage && (
                    <button
                      onClick={() => { setPreviewImage(null); setImageFile(null); }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อเมนู *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                  placeholder="เช่น ข้าวหมูแดง"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-brand-500"
                  placeholder="อธิบายเมนู..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ราคา (บาท)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                  >
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <label htmlFor="available" className="text-sm text-slate-700">เปิดขาย</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {uploading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📂 เพิ่มหมวดหมู่</h2>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสหมวดหมู่ *</label>
                <input
                  type="text"
                  value={newCategory.id}
                  onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                  placeholder="เช่น appetizer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อหมวดหมู่ *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                  placeholder="เช่น อาหารเรียกน้ำย่อย"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ไอคอน (Emoji)</label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 text-center text-2xl"
                  placeholder="📦"
                  maxLength={2}
                />
              </div>

              {/* Existing Categories */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">หมวดหมู่ที่มีอยู่:</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <span key={cat.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm">
                      {cat.icon} {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2"
              >
                <FolderPlus size={18} />
                เพิ่มหมวดหมู่
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { menuAPI, categoriesAPI } from '../lib/api';
import { Product, Category } from '../types';

interface UseMenuResult {
  menuItems: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMenu(): UseMenuResult {
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [menuData, catData] = await Promise.all([
        menuAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      
      // Map API response to frontend format
      const mappedMenu: Product[] = menuData.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        image: item.image_url || '/images/placeholder.jpg',
        category: item.category_id,
        categoryId: item.category_id,
        options: item.options ? (typeof item.options === 'string' ? JSON.parse(item.options) : 
          item.options.id ? [item.options] : item.options) : undefined,
        available: item.available,
        isSpecial: item.is_special,
      }));
      
      const mappedCategories: Category[] = catData.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || '📦',
      }));
      
      setMenuItems(mappedMenu.filter(item => item.available));
      setCategories(mappedCategories);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('ไม่สามารถโหลดเมนูได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    menuItems,
    categories,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useMenu;

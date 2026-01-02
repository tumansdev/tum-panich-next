import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (product) => {
        const { favorites } = get();
        if (!favorites.find(f => f.id === product.id)) {
          set({ favorites: [...favorites, product] });
        }
      },
      
      removeFavorite: (productId) => {
        set({ favorites: get().favorites.filter(f => f.id !== productId) });
      },
      
      isFavorite: (productId) => {
        return get().favorites.some(f => f.id === productId);
      },
      
      toggleFavorite: (product) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.find(f => f.id === product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'tumpanich-favorites',
    }
  )
);

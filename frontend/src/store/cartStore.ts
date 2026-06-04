import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const currentItems = state.items || [];
        const existingItem = currentItems.find((i) => i.id === item.id);
        if (existingItem) {
          return {
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...currentItems, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: (state.items || []).filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: (state.items || []).map((i) => (i.id === id ? { ...i, quantity } : i)),
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => (get().items || []).reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'zcraft-cart-storage',
    }
  )
);

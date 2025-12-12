import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Food, CartItem, User, Order } from '../types';

interface AppState {
  user: User | null;
  foods: Food[];
  cart: CartItem[];
  orders: Order[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  
  addFood: (food: Food) => void;
  updateFood: (food: Food) => void;
  deleteFood: (id: string) => void;
  
  addToCart: (food: Food) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  
  createOrder: () => void;
}

const INITIAL_FOODS: Food[] = [
  {
    id: '1',
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng with shredded chicken, sunny side up egg, and crackers.",
    price: 25000,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    ingredients: ['Rice', 'Chicken', 'Egg', 'Chili', 'Soy Sauce']
  },
  {
    id: '2',
    name: "Sate Ayam Madura",
    description: "Chicken satay with thick peanut sauce and rice cakes.",
    price: 30000,
    image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=800&q=80",
    ingredients: ['Chicken', 'Peanut Sauce', 'Sweet Soy Sauce', 'Shallots']
  },
  {
    id: '3',
    name: "Es Teh Manis",
    description: "Refreshing sweet iced tea.",
    price: 5000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    ingredients: ['Tea', 'Sugar', 'Ice', 'Water']
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      foods: INITIAL_FOODS,
      cart: [],
      orders: [],

      login: (user) => set({ user }),
      logout: () => set({ user: null, cart: [] }),

      addFood: (food) => set((state) => ({ foods: [...state.foods, food] })),
      updateFood: (food) => set((state) => ({
        foods: state.foods.map((f) => (f.id === food.id ? food : f)),
      })),
      deleteFood: (id) => set((state) => ({
        foods: state.foods.filter((f) => f.id !== id),
      })),

      addToCart: (food) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === food.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...food, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),

      updateCartQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
          }
          return item;
        }).filter((item) => item.quantity > 0),
      })),

      clearCart: () => set({ cart: [] }),

      createOrder: () => {
        const { cart, user, orders } = get();
        if (!user || cart.length === 0) return;

        const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const newOrder: Order = {
          id: crypto.randomUUID(),
          userId: user.id,
          items: cart.map(c => ({
            id: crypto.randomUUID(),
            foodId: c.id,
            name: c.name,
            price: c.price,
            quantity: c.quantity
          })),
          totalPrice,
          status: 'COMPLETED',
          createdAt: new Date().toISOString()
        };

        set({
          orders: [newOrder, ...orders],
          cart: []
        });
      },
    }),
    {
      name: 'foodease-storage',
      partialize: (state) => ({ 
        user: state.user, 
        cart: state.cart, 
        orders: state.orders,
        foods: state.foods 
      }),
    }
  )
);

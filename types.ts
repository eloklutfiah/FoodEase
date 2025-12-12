export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: 'USER' | 'ADMIN';
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[]; // Keeping for AI generation context
}

export interface CartItem extends Food {
  quantity: number;
}

export interface OrderItem {
  id: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export type ViewState = 'home' | 'cart' | 'orders' | 'admin' | 'food-detail';

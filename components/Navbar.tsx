import React from 'react';
import { ShoppingCart, User as UserIcon, LogOut, History, ShieldCheck, Utensils } from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../lib/store';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenCart }) => {
  const { user, cart, login, logout } = useStore();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleMockLogin = () => {
    login({
      id: 'user-123',
      name: 'User Demo',
      email: 'user@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      role: 'ADMIN' // Defaulting to Admin for demo purposes so you can see features
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-primary shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer gap-2" 
            onClick={() => onNavigate('home')}
          >
            <div className="bg-white p-1.5 rounded-lg text-brand-primary">
                <Utensils className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              FoodEase
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-4">
             <button 
              onClick={() => onNavigate('home')}
              className={`hover:text-brand-light transition-colors ${currentView === 'home' ? 'font-bold underline decoration-2 underline-offset-4' : ''}`}
            >
              Home
            </button>
            
            <button 
              onClick={() => onNavigate('orders')}
              className={`hover:text-brand-light transition-colors ${currentView === 'orders' ? 'font-bold underline decoration-2 underline-offset-4' : ''}`}
            >
              Orders
            </button>

            {user?.role === 'ADMIN' && (
              <button 
                onClick={() => onNavigate('admin')}
                className={`hover:text-brand-light transition-colors flex items-center gap-1 ${currentView === 'admin' ? 'font-bold underline decoration-2 underline-offset-4' : ''}`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            )}

            <div className="h-6 w-px bg-white/20 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white" />
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleMockLogin}
                className="flex items-center px-4 py-2 bg-white text-brand-primary font-bold rounded-full shadow-sm hover:bg-gray-100 transition-all"
              >
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4 mr-2" />
                Sign in
              </button>
            )}

            {/* Cart Icon */}
            <button 
              onClick={onOpenCart}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-brand-primary">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

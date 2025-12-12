import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../lib/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose,
  onNavigate
}) => {
  const { cart, removeFromCart, updateCartQuantity, createOrder, user } = useStore();
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!user) {
        alert("Please sign in first!");
        return;
    }
    createOrder();
    onClose();
    onNavigate('orders');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="flex-1 flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-primary text-white">
            <h2 className="text-lg font-bold flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shopping Cart
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <ShoppingBag className="w-10 h-10" />
                </div>
                <p className="text-gray-500 text-lg">Your cart is empty.</p>
                <button 
                    onClick={onClose} 
                    className="mt-4 text-brand-primary font-bold hover:underline"
                >
                    Start Shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-brand-primary font-bold text-sm mt-1">Rp {item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center mt-3">
                        <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                            -
                        </button>
                        <span className="mx-3 font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-dark"
                        >
                            +
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 text-lg">Total</span>
                <span className="text-2xl font-bold text-brand-dark">Rp {total.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-brand-dark transition-colors shadow-lg"
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

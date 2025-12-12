import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { OrderHistory } from './components/OrderHistory';
import { ViewState, Food } from './types';
import { useStore } from './lib/store';
import { Plus, Info } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  
  const { foods, addToCart } = useStore();

  const handleAddToCart = (item: Food) => {
    addToCart(item);
    setIsCartOpen(true);
  };

  const renderHome = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4 tracking-tight">
          Delicious Food, <span className="text-brand-primary">Delivered.</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Order your favorite meals from our exclusive menu. Fresh ingredients, authentic taste, delivered right to your table.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {foods.map(item => (
          <div key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-primary/20 overflow-hidden flex flex-col h-full">
            <div className="relative h-56 overflow-hidden cursor-pointer bg-gray-100" onClick={() => setSelectedFood(item)}>
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-brand-primary transition-colors" onClick={() => setSelectedFood(item)}>
                    {item.name}
                </h3>
              </div>
              
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-lg font-bold text-brand-primary">
                    Rp {item.price.toLocaleString()}
                </span>
                <button 
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-brand-primary transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFood(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <button 
                onClick={() => setSelectedFood(null)} 
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors z-20 shadow-sm"
            >
                <Plus className="w-6 h-6 rotate-45 text-black" />
            </button>
            <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                    <img src={selectedFood.image} alt={selectedFood.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="mb-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{selectedFood.name}</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {selectedFood.description}
                        </p>
                        
                        {selectedFood.ingredients && selectedFood.ingredients.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-bold text-xs uppercase text-gray-400 mb-2 tracking-wider">Ingredients</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFood.ingredients.map((ing, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <span className="text-2xl font-bold text-brand-primary">
                            Rp {selectedFood.price.toLocaleString()}
                        </span>
                        <button 
                            onClick={() => {
                                handleAddToCart(selectedFood);
                                setSelectedFood(null);
                            }}
                            className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navbar 
        currentView={view}
        onNavigate={setView}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="flex-1 relative pb-20">
        {view === 'home' && renderHome()}
        {view === 'admin' && <AdminPanel />}
        {view === 'orders' && <OrderHistory />}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onNavigate={setView}
      />
    </div>
  );
};

export default App;

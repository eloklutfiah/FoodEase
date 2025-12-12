import React from 'react';
import { useStore } from '../lib/store';
import { Package, Calendar } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { orders } = useStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Package className="w-8 h-8 mr-3 text-brand-primary" />
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
           <p className="text-gray-400 text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-light p-2 rounded-lg text-brand-primary">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Order ID: #{order.id.slice(0, 8)}</p>
                        <p className="font-bold text-gray-800">
                            {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-100 text-green-800 border border-green-200">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-3">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center text-gray-700">
                                <span className="font-bold text-brand-dark mr-2">{item.quantity}x</span>
                                <span>{item.name}</span>
                            </div>
                            <span className="text-gray-500 font-medium">Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 -mx-6 -mb-6 px-6 py-4">
                   <span className="text-gray-500 font-medium">Total Amount</span>
                   <span className="text-xl font-bold text-brand-primary">Rp {order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

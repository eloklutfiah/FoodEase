import React, { useState } from 'react';
import { Food } from '../types';
import { Plus, Edit, Trash, Sparkles, X, Save, Image as ImageIcon } from 'lucide-react';
import { generateFoodDescription } from '../services/geminiService';
import { useStore } from '../lib/store';

export const AdminPanel: React.FC = () => {
  const { foods, addFood, updateFood, deleteFood } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Food>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const initialFormState: Partial<Food> = {
    name: '',
    price: 0,
    description: '',
    ingredients: [],
    image: '/images/668b52974ead4.jpg',
  };

  const handleEdit = (item: Food) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditingItem({ ...initialFormState, id: crypto.randomUUID() });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingItem.name || !editingItem.price) return;
    
    const itemToSave = editingItem as Food;
    if (foods.find(f => f.id === itemToSave.id)) {
      updateFood(itemToSave);
    } else {
      addFood(itemToSave);
    }
    setIsEditing(false);
    setEditingItem({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this food item?')) {
      deleteFood(id);
    }
  };

  const handleGenerateDescription = async () => {
    if (!editingItem.name) {
      alert("Please enter a name first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateFoodDescription(
      editingItem.name, 
      editingItem.ingredients || []
    );
    setEditingItem(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleIngredientChange = (text: string) => {
    const ingredients = text.split(',').map(i => i.trim()).filter(i => i.length > 0);
    setEditingItem(prev => ({ ...prev, ingredients }));
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {foods.find(f => f.id === editingItem.id) ? 'Edit Item' : 'New Food Item'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Food Name</label>
            <input 
              type="text" 
              value={editingItem.name || ''} 
              onChange={e => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              placeholder="e.g., Nasi Goreng"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (Rp)</label>
              <input 
                type="number" 
                value={editingItem.price || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="25000"
              />
            </div>
             <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredients (Optional)</label>
              <input 
                type="text" 
                value={editingItem.ingredients?.join(', ') || ''} 
                onChange={e => handleIngredientChange(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="e.g., rice, egg, chicken"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <button 
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !editingItem.name}
                  className="text-xs flex items-center bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 disabled:opacity-50 font-medium transition-colors"
                >
                    {isGenerating ? 'AI Thinking...' : <><Sparkles className="w-3 h-3 mr-1" /> Auto-Generate with AI</>}
                </button>
            </div>
            <textarea 
              value={editingItem.description || ''} 
              onChange={e => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="Enter description..."
            />
          </div>
          
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                value={editingItem.image || ''} 
                onChange={e => setEditingItem(prev => ({ ...prev, image: e.target.value }))}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                placeholder="https://..."
                />
                <button 
                    onClick={() => setEditingItem(prev => ({ ...prev, image: `https://source.unsplash.com/random/800x600/?food&sig=${Date.now()}` }))}
                    className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200"
                    title="Random Image"
                >
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
             <button 
              onClick={handleSave}
              className="flex items-center px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-dark font-bold shadow-sm transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard 🛡️</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center px-5 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Food
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foods.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-lg object-cover shadow-sm" src={item.image} alt="" />
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">
                  Rp {item.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4 p-1 hover:bg-blue-50 rounded">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

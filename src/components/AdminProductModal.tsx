import React, { useState } from 'react';
import { Category, Product } from '../types';
import { createProduct } from '../lib/supabase';
import { X, PlusCircle, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onProductCreated: (p: Product) => void;
  isSupabaseLive: boolean;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  onProductCreated,
  isSupabaseLive,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    stock: '50',
    category_id: categories[0]?.id || 1,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.image_url) {
      setError('Please fill out the title, price, and image URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: Omit<Product, 'id'> = {
        name: formData.title,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        rating: 5.0,
        reviews_count: 1,
        stock: parseInt(formData.stock) || 50,
        image_url: formData.image_url,
        category_id: Number(formData.category_id),
        is_featured: formData.is_featured,
      };

      const { product } = await createProduct(payload);
      onProductCreated(product);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create product in Supabase. Ensure your database tables exist and credentials are set.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ultra-Light Running Jacket"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category * (from public.categories)
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="49.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Original Price ($) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="69.99"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Image URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
              />
            </div>
            {formData.image_url && (
              <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of features, materials, and sizing..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="is_featured" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Mark as Featured Product
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Inserting into Supabase...</span>
              </>
            ) : (
              <span>Save to Supabase Database</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

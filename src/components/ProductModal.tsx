import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  categoryName?: string;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categoryName,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[280px]">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.is_featured && (
            <span className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Featured Pick
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">
              <span>{categoryName || `Category #${product.category_id}`}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{(product.rating ?? 4.8).toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviews_count ?? 80} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {product.name || product.title}
            </h2>

            <div className="flex items-baseline gap-2 mt-3 mb-4">
              <span className="text-2xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Badges */}
            <div className="space-y-2 py-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-600" />
                <span>Free delivery on orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>1-Year Quality Warranty & Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-teal-600" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-medium text-slate-600">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400">
                ({product.stock} available in stock)
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart (${(product.price * quantity).toFixed(2)})</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Product } from '../types';
import { Star, Plus, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName,
  onAddToCart,
  onQuickView,
  isAdded,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Tag */}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Popular
          </span>
        )}

        {/* Discount Tag */}
        {product.original_price && product.original_price > product.price && (
          <span className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            Save ${(product.original_price - product.price).toFixed(0)}
          </span>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none sm:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3.5 py-1.5 bg-white/95 text-slate-800 text-xs font-semibold rounded-full shadow-md flex items-center gap-1.5 hover:bg-white hover:text-teal-700 transition-all transform -translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              {categoryName || `Category #${product.category_id}`}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{(product.rating ?? 4.8).toFixed(1)}</span>
              <span className="text-slate-400 text-[11px]">({product.reviews_count ?? 80})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 hover:text-teal-600 cursor-pointer transition-colors"
            title={product.name || product.title}
          >
            {product.name || product.title}
          </h3>

          {/* Short description */}
          <p className="text-slate-500 text-xs line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 block">
              In Stock: {product.stock}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`p-2.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-md hover:shadow-teal-600/20'
            }`}
            title="Add to cart"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

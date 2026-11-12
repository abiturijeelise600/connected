import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, Sparkles } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onSelectCategory: (id: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onSelectCategory }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 mb-8">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fullstack Supabase E-Commerce</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Curated Essentials for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Everyday Modern Life
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Real-time product catalog & instant checkout connected directly to your Supabase project. Browse clothes, footwear, tech gadgets, and premium accessories.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Supabase Database Sync</span>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-3 gap-2 pt-6 max-w-lg border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Instant Supabase sync</span>
              </div>
            </div>
          </div>

          {/* Quick Category Badges */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { id: 1, name: 'Clothes', icon: '👕', count: '4 Items', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80' },
              { id: 2, name: 'Shoes', icon: '👟', count: '4 Items', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80' },
              { id: 3, name: 'Electronics', icon: '🎧', count: '4 Items', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
              { id: 4, name: 'Accessories', icon: '🎒', count: '4 Items', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800 hover:border-teal-500/50 transition-all text-left shadow-lg"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Category ID: #{cat.id}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShoppingBag, Database, Search, PlusCircle, Sparkles, CheckCircle2, AlertCircle, User, LogOut } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenConfig: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  currentUser: any;
  isSupabaseLive: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenConfig,
  onOpenAdmin,
  onOpenAuth,
  onSignOut,
  currentUser,
  isSupabaseLive,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              NovaStore
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
              Supabase Ready
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clothes, shoes, electronics, accessories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white rounded-full border border-transparent focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenConfig}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Configure Supabase Connection"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isSupabaseLive ? 'Supabase Connected' : 'Connect Supabase'}
            </span>
            {isSupabaseLive ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            )}
          </button>

          {/* Add Product Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-full transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          {/* User Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-100 pl-2.5 pr-1.5 py-1 rounded-full border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800 max-w-[100px] sm:max-w-[140px] truncate" title={currentUser.email}>
                {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={onSignOut}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-200 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-full transition-all"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-teal-600 bg-slate-100 hover:bg-teal-50 rounded-full transition-all"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-scaleIn">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 focus:bg-white rounded-full border border-transparent focus:border-teal-500 focus:outline-none transition-all"
          />
        </div>
      </div>
    </header>
  );
};

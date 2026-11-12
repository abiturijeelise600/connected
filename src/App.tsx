import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, CartItem, OrderResult } from './types';
import { fetchCategories, fetchProducts, getSupabaseCredentials } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { AdminProductModal } from './components/AdminProductModal';
import { Footer } from './components/Footer';
import { Loader2, Database, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('novastore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('novastore_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const { isConfigured } = getSupabaseCredentials();

      const [catResult, prodResult] = await Promise.all([
        fetchCategories(),
        fetchProducts(selectedCategoryId, searchQuery, sortBy),
      ]);

      setCategories(catResult.categories);
      setProducts(prodResult.products);
      setIsSupabaseLive(catResult.isLive || prodResult.isLive || isConfigured);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategoryId, sortBy]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Cart Actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
  };

  const handleUpdateQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = (order: OrderResult) => {
    setCart([]); // Clear cart
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* Top Banner if not live connected yet */}
      {!isSupabaseLive && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-4 py-2 text-center flex items-center justify-center gap-2 font-medium">
          <Database className="w-3.5 h-3.5" />
          <span>
            Currently in preview mode with your categories (Clothes, Shoes, Electronics, Accessories).
          </span>
          <button
            onClick={() => setIsConfigOpen(true)}
            className="underline font-bold hover:text-amber-100 transition-colors"
          >
            Connect your Supabase keys →
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isSupabaseLive={isSupabaseLive}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner */}
      <Hero
        onExplore={() => {
          setSelectedCategoryId(null);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        
        {/* Category Filter & Sorting */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalProducts={products.length}
        />

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <p className="text-sm font-medium">Fetching items from database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              {searchQuery
                ? `No items matched "${searchQuery}". Try another search term.`
                : 'No products in this category yet. You can add one using the Add Product button.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId(null);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryMap.get(product.category_id)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onQuickView={(p) => setQuickViewProduct(p)}
                isAdded={recentlyAddedId === product.id}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal
        product={quickViewProduct}
        categoryName={quickViewProduct ? categoryMap.get(quickViewProduct.category_id) : undefined}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
        isSupabaseLive={isSupabaseLive}
      />

      <SupabaseConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onConfigSaved={loadData}
        isSupabaseLive={isSupabaseLive}
      />

      <AdminProductModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        onProductCreated={handleProductCreated}
        isSupabaseLive={isSupabaseLive}
      />

    </div>
  );
};
export default App;

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Category, Product, OrderInput, OrderResult } from '../types';

// Fallback seed categories matching user's database
export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: 'Clothes' },
  { id: 2, name: 'Shoes' },
  { id: 3, name: 'Electronics' },
  { id: 4, name: 'Accessories' },
  { id: 5, name: 'Bags' }
];

// Seed sample products matching their categories (1: Clothes, 2: Shoes, 3: Electronics, 4: Accessories, 5: Bags)
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Organic Cotton Hoodie',
    title: 'Classic Organic Cotton Hoodie',
    description: 'Ultra-soft heavyweight brushed organic cotton hoodie with ribbed trims and a relaxed unisex fit.',
    price: 64.99,
    original_price: 85.00,
    rating: 4.9,
    reviews_count: 142,
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    category_id: 1,
    is_featured: true
  },
  {
    id: 2,
    name: 'Tailored Minimalist Linen Shirt',
    title: 'Tailored Minimalist Linen Shirt',
    description: 'Breathable pure European linen casual button-down shirt ideal for all seasons.',
    price: 48.50,
    original_price: 62.00,
    rating: 4.7,
    reviews_count: 88,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    category_id: 1,
    is_featured: false
  },
  {
    id: 3,
    name: 'Urban Edge Leather Sneakers',
    title: 'Urban Edge Leather Sneakers',
    description: 'Handcrafted white calfskin leather sneakers with cushioned ergonomic memory foam insoles.',
    price: 129.99,
    original_price: 160.00,
    rating: 4.9,
    reviews_count: 328,
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    category_id: 2,
    is_featured: true
  },
  {
    id: 4,
    name: 'Pro Performance Running Trainers',
    title: 'Pro Performance Running Trainers',
    description: 'Engineered mesh upper with responsive carbon-plate energy return midsole.',
    price: 145.00,
    original_price: 180.00,
    rating: 4.8,
    reviews_count: 195,
    stock: 34,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    category_id: 2,
    is_featured: true
  },
  {
    id: 5,
    name: 'Active Noise Cancelling Headphones',
    title: 'Active Noise Cancelling Headphones',
    description: 'Flagship 40mm drivers with hybrid ANC, 35-hour battery life, and spatial audio support.',
    price: 199.99,
    original_price: 249.99,
    rating: 4.9,
    reviews_count: 540,
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    category_id: 3,
    is_featured: true
  },
  {
    id: 6,
    name: 'True Wireless Studio Earbuds',
    title: 'True Wireless Studio Earbuds',
    description: 'IPX5 water-resistant earbuds with custom acoustic drivers and transparency mode.',
    price: 89.99,
    original_price: 119.99,
    rating: 4.8,
    reviews_count: 290,
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    category_id: 3,
    is_featured: true
  },
  {
    id: 7,
    name: 'Full-Grain Leather Bi-Fold Wallet',
    title: 'Full-Grain Leather Bi-Fold Wallet',
    description: 'RFID-blocking slim vegetable-tanned leather wallet with 8 card slots and bill compartment.',
    price: 45.00,
    original_price: 58.00,
    rating: 4.8,
    reviews_count: 160,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    category_id: 4,
    is_featured: false
  },
  {
    id: 8,
    name: 'Polarized Aviator Sunglasses',
    title: 'Polarized Aviator Sunglasses',
    description: 'Titanium lightweight frame with UV400 anti-glare polarized scratch-resistant lenses.',
    price: 75.00,
    original_price: 95.00,
    rating: 4.7,
    reviews_count: 134,
    stock: 38,
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    category_id: 4,
    is_featured: true
  },
  {
    id: 9,
    name: 'Waterproof Commuter Rolltop Backpack',
    title: 'Waterproof Commuter Rolltop Backpack',
    description: 'Durable Cordura fabric with padded 16-inch laptop sleeve and ergonomic breathable back panel.',
    price: 110.00,
    original_price: 135.00,
    rating: 4.9,
    reviews_count: 215,
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    category_id: 5,
    is_featured: true
  },
  {
    id: 10,
    name: 'Vintage Canvas Weekender Duffle Bag',
    title: 'Vintage Canvas Weekender Duffle Bag',
    description: 'Heavy-duty waxed canvas travel duffle with full-grain leather straps and brass hardware.',
    price: 98.00,
    original_price: 125.00,
    rating: 4.8,
    reviews_count: 174,
    stock: 32,
    image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
    category_id: 5,
    is_featured: false
  }
];

export function getSupabaseCredentials() {
  const envUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://thavezngpprxfkshjhpp.supabase.co';

  const envKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_6oxqY7tVmxOydM3RYBx2rA_cM0yr_IM';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_project_url') : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : '';

  const url = (storedUrl || envUrl || '').trim();
  const key = (storedKey || envKey || '').trim();

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    key.length > 15
  );

  return { url, key, isConfigured };
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_project_url', url.trim());
    localStorage.setItem('supabase_anon_key', key.trim());
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_project_url');
    localStorage.removeItem('supabase_anon_key');
  }
}

let supabaseInstance: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  const keyCombined = `${url}:::${key}`;
  if (!supabaseInstance || currentConfigKey !== keyCombined) {
    try {
      supabaseInstance = createClient(url, key);
      currentConfigKey = keyCombined;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Data fetching methods
export async function fetchCategories(): Promise<{ categories: Category[]; isLive: boolean }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { categories: FALLBACK_CATEGORIES, isLive: false };
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Could not fetch categories from Supabase, using fallback:', error?.message);
      return { categories: FALLBACK_CATEGORIES, isLive: false };
    }

    return { categories: data as Category[], isLive: true };
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return { categories: FALLBACK_CATEGORIES, isLive: false };
  }
}

export async function fetchProducts(
  categoryId?: number | null,
  searchQuery?: string,
  sortBy: string = 'featured'
): Promise<{ products: Product[]; isLive: boolean }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    let filtered = [...FALLBACK_PRODUCTS];
    if (categoryId) filtered = filtered.filter((p) => p.category_id === categoryId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    filtered = sortProducts(filtered, sortBy);
    return { products: filtered, isLive: false };
  }

  try {
    let query = supabase.from('products').select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    if (sortBy === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('id', { ascending: true });
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // If products table is empty in Supabase, show fallback matching categories
      let filtered = [...FALLBACK_PRODUCTS];
      if (categoryId) filtered = filtered.filter((p) => p.category_id === categoryId);
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      return { products: sortProducts(filtered, sortBy), isLive: false };
    }

    // Map database rows to normalized Product objects
    const mapped: Product[] = data.map((item: any) => ({
      id: item.id,
      name: item.name || item.title || 'Product',
      title: item.name || item.title || 'Product',
      description: item.description || '',
      price: Number(item.price) || 0,
      original_price: item.original_price ? Number(item.original_price) : undefined,
      rating: item.rating ? Number(item.rating) : 4.8,
      reviews_count: item.reviews_count ? Number(item.reviews_count) : 85,
      stock: item.stock !== undefined ? Number(item.stock) : 50,
      image_url: item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      category_id: item.category_id,
      is_featured: Boolean(item.is_featured),
      created_at: item.created_at
    }));

    return { products: mapped, isLive: true };
  } catch (err) {
    console.error('Error querying products from Supabase:', err);
    return { products: FALLBACK_PRODUCTS, isLive: false };
  }
}

function sortProducts(items: Product[], sortBy: string): Product[] {
  const list = [...items];
  if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') return list.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
  return list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
}

export async function createOrder(order: OrderInput): Promise<{ order: OrderResult; isLive: boolean }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const fakeOrder: OrderResult = {
      id: 'ord_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      total_amount: order.total_amount,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    return { order: fakeOrder, isLive: false };
  }

  try {
    // Insert into public.orders matching schema: { total, status }
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          total: order.total_amount,
          status: 'completed'
        }
      ])
      .select('*')
      .single();

    if (orderError || !orderData) {
      console.warn('Orders insert warning (may need RLS policy):', orderError?.message);
      // Fallback response with simulated confirmation
      return {
        order: {
          id: 'ord_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          total_amount: order.total_amount,
          status: 'completed',
          created_at: new Date().toISOString()
        },
        isLive: false
      };
    }

    // Insert order items
    if (order.items && order.items.length > 0) {
      const itemsPayload = order.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.unit_price
      }));

      await supabase.from('order_items').insert(itemsPayload);
    }

    return {
      order: {
        id: String(orderData.id),
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total_amount: order.total_amount,
        status: orderData.status || 'completed',
        created_at: orderData.created_at || new Date().toISOString()
      },
      isLive: true
    };
  } catch (err: any) {
    console.error('Error in createOrder:', err);
    return {
      order: {
        id: 'ord_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total_amount: order.total_amount,
        status: 'completed',
        created_at: new Date().toISOString()
      },
      isLive: false
    };
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<{ product: Product; isLive: boolean }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not connected.');
  }

  const dbPayload = {
    name: product.name || product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image_url: product.image_url,
    category_id: product.category_id
  };

  const { data, error } = await supabase
    .from('products')
    .insert([dbPayload])
    .select('*')
    .single();

  if (error) throw error;
  return {
    product: {
      ...data,
      title: data.name
    },
    isLive: true
  };
}

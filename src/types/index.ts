export interface Category {
  id: number;
  name: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  title?: string;
  description: string;
  price: number;
  original_price?: number;
  rating?: number;
  reviews_count?: number;
  stock: number;
  image_url: string;
  category_id: number;
  is_featured?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderInput {
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  phone_number?: string;
  payment_method: string;
  total_amount: number;
  user_id?: string;
  stripe_payment_id?: string;
  items: {
    product_id: number;
    product_title: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface OrderResult {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

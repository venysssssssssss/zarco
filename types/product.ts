export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  description?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  product?: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  name: string;
  email: string;
}
import { CartItem } from '@/types/product';
import { 
  getCartByUserId, 
  addToCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearCart, 
  getCartItemCount 
} from '@/lib/db/cartRepository';

export interface ICartService {
  getCartItems(userId: string): Promise<CartItem[]>;
  addItemToCart(userId: string, productId: string, quantity?: number): Promise<CartItem | null>;
  updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartItem | null>;
  removeItem(userId: string, productId: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  getItemCount(userId: string): Promise<number>;
}

class CartService implements ICartService {
  async getCartItems(userId: string): Promise<CartItem[]> {
    return getCartByUserId(userId);
  }

  async addItemToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem | null> {
    return addToCart(userId, productId, quantity);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartItem | null> {
    return updateCartItemQuantity(userId, productId, quantity);
  }

  async removeItem(userId: string, productId: string): Promise<boolean> {
    return removeFromCart(userId, productId);
  }

  async clearCart(userId: string): Promise<boolean> {
    return clearCart(userId);
  }

  async getItemCount(userId: string): Promise<number> {
    return getCartItemCount(userId);
  }
}

export const cartService = new CartService();
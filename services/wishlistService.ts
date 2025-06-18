import { WishlistItem } from '@/types/product';
import { getWishlistByUserId, addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/db/wishlistRepository';

export interface IWishlistService {
  getWishlistItems(userId: string): Promise<WishlistItem[]>;
  addItemToWishlist(userId: string, productId: string): Promise<WishlistItem | null>;
  removeItemFromWishlist(userId: string, productId: string): Promise<boolean>;
  checkIfInWishlist(userId: string, productId: string): Promise<boolean>;
}

class WishlistService implements IWishlistService {
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return getWishlistByUserId(userId);
  }

  async addItemToWishlist(userId: string, productId: string): Promise<WishlistItem | null> {
    return addToWishlist(userId, productId);
  }

  async removeItemFromWishlist(userId: string, productId: string): Promise<boolean> {
    return removeFromWishlist(userId, productId);
  }

  async checkIfInWishlist(userId: string, productId: string): Promise<boolean> {
    return isInWishlist(userId, productId);
  }
}

export const wishlistService = new WishlistService();
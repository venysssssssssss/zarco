import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { WishlistItem } from '@/types/product';
import { findProductById } from './productRepository';

export async function getWishlistByUserId(userId: string): Promise<WishlistItem[]> {
  const items = db.prepare('SELECT * FROM wishlist WHERE user_id = ?').all(userId) as WishlistItem[];
  
  // Carrega os produtos associados aos itens da wishlist
  const itemsWithProducts = await Promise.all(
    items.map(async (item) => {
      const product = await findProductById(item.product_id);
      return {
        ...item,
        product: product || undefined // Convert null to undefined to match WishlistItem type
      };
    })
  );
  
  return itemsWithProducts;
}

export async function addToWishlist(userId: string, productId: string): Promise<WishlistItem | null> {
  try {
    // Verifica se o produto existe
    const product = await findProductById(productId);
    if (!product) return null;
    
    // Verifica se o item já está na wishlist
    const existing = db.prepare('SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?')
      .get(userId, productId);
    
    if (existing) return existing as WishlistItem;
    
    // Adiciona o item à wishlist
    const id = uuidv4();
    db.prepare('INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)')
      .run(id, userId, productId);
    
    return { 
      id, 
      user_id: userId, 
      product_id: productId,
      product
    };
  } catch (error) {
    console.error('Erro ao adicionar item à wishlist:', error);
    return null;
  }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    const result = db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?')
      .run(userId, productId);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao remover item da wishlist:', error);
    return false;
  }
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const item = db.prepare('SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?')
    .get(userId, productId);
  
  return !!item;
}
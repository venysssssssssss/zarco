import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { CartItem } from '@/types/product';
import { findProductById } from './productRepository';

export async function getCartByUserId(userId: string): Promise<CartItem[]> {
  const items = db.prepare('SELECT * FROM cart WHERE user_id = ?').all(userId) as CartItem[];
  
  // Carrega os produtos associados aos itens do carrinho
  const itemsWithProducts = await Promise.all(
    items.map(async (item) => {
      const product = await findProductById(item.product_id);
      return {
        ...item,
        product: product || undefined
      };
    })
  );
  
  return itemsWithProducts;
}

export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartItem | null> {
  try {
    // Verifica se o produto existe
    const product = await findProductById(productId);
    if (!product) return null;
    
    // Verifica se o produto já está no carrinho
    const existing = db.prepare('SELECT * FROM cart WHERE user_id = ? AND product_id = ?')
      .get(userId, productId) as CartItem | undefined;
    
    if (existing) {
      // Atualiza a quantidade
      const newQuantity = existing.quantity + quantity;
      db.prepare('UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newQuantity, existing.id);
      
      return { 
        ...existing, 
        quantity: newQuantity,
        product: product || undefined
      };
    }
    
    // Adiciona novo item ao carrinho
    const id = uuidv4();
    db.prepare('INSERT INTO cart (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)')
      .run(id, userId, productId, quantity);
    
    return { 
      id, 
      user_id: userId, 
      product_id: productId,
      quantity,
      product: product || undefined
    };
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    return null;
  }
}

export async function updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<CartItem | null> {
  try {
    if (quantity <= 0) {
      return await removeFromCart(userId, productId) ? null : null;
    }
    
    const item = db.prepare('SELECT * FROM cart WHERE user_id = ? AND product_id = ?')
      .get(userId, productId) as CartItem | undefined;
    
    if (!item) return null;
    
    db.prepare('UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(quantity, item.id);
    
    const product = await findProductById(productId);
    
    return {
      ...item,
      quantity,
      product: product || undefined
    };
  } catch (error) {
    console.error('Erro ao atualizar quantidade do item:', error);
    return null;
  }
}

export async function removeFromCart(userId: string, productId: string): Promise<boolean> {
  try {
    const result = db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?')
      .run(userId, productId);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    return false;
  }
}

export async function clearCart(userId: string): Promise<boolean> {
  try {
    const result = db.prepare('DELETE FROM cart WHERE user_id = ?')
      .run(userId);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    return false;
  }
}

export async function getCartItemCount(userId: string): Promise<number> {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM cart WHERE user_id = ?')
      .get(userId) as { count: number };
    
    return result.count;
  } catch (error) {
    console.error('Erro ao contar itens do carrinho:', error);
    return 0;
  }
}
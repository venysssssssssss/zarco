import { Product } from '@/types/product';
import { getFeaturedProducts, getAllProducts, getProductsByCategory, findProductById } from '@/lib/db/productRepository';

export interface IProductService {
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}

class ProductService implements IProductService {
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return getFeaturedProducts(limit);
  }
  
  async getAllProducts(): Promise<Product[]> {
    return getAllProducts();
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return getProductsByCategory(category);
  }
  
  async getProductById(id: string): Promise<Product | null> {
    return findProductById(id);
  }
}

export const productService = new ProductService();
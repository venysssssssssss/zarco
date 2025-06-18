import { v4 as uuidv4 } from 'uuid';
import db from './database';
import { Product } from '@/types/product';

export async function findProductById(id: string): Promise<Product | null> {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | null;
  return product;
}

export async function getAllProducts(): Promise<Product[]> {
  const products = db.prepare('SELECT * FROM products').all() as Product[];
  return products;
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const products = db.prepare('SELECT * FROM products WHERE featured = 1 LIMIT ?').all(limit) as Product[];
  return products;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = db.prepare('SELECT * FROM products WHERE category = ?').all(category) as Product[];
  return products;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT INTO products (id, name, description, price, image_url, category, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id, 
    product.name, 
    product.description, 
    product.price,
    product.image_url,
    product.category,
    product.stock,
    product.featured ? 1 : 0
  );
  
  return {
    id,
    ...product
  };
}

export async function seedProducts(): Promise<void> {
  // Verificar se já existem produtos
  const existingProducts = await getAllProducts();
  if (existingProducts.length > 0) {
    return;
  }
  
  // Produtos para seed
  const products = [
    {
      name: 'Camisa Básica Branca',
      description: 'Camisa básica de algodão em cor branca, ideal para o dia a dia.',
      price: 69.90,
      image_url: '/products/camisa-basica-branca.jpg',
      category: 'básica',
      stock: 100,
      featured: true,
    },
    {
      name: 'Camisa Polo Preta',
      description: 'Camisa polo em cor preta, perfeita para ocasiões casuais ou semi-formais.',
      price: 89.90,
      image_url: '/products/camisa-polo-preta.jpg',
      category: 'polo',
      stock: 80,
      featured: true,
    },
    {
      name: 'Camisa Social Slim',
      description: 'Camisa social de corte slim em algodão fino, ideal para ambiente de trabalho.',
      price: 129.90,
      image_url: '/products/camisa-social-slim.jpg',
      category: 'social',
      stock: 50,
      featured: true,
    },
    {
      name: 'Camisa Estampada Tropical',
      description: 'Camisa com estampa tropical, perfeita para ocasiões descontraídas.',
      price: 99.90,
      image_url: '/products/camisa-estampada.jpg',
      category: 'casual',
      stock: 60,
      featured: true,
    },
    {
      name: 'Camisa Jeans',
      description: 'Camisa em tecido jeans leve para um visual moderno e despojado.',
      price: 119.90,
      image_url: '/products/camisa-jeans.jpg',
      category: 'casual',
      stock: 45,
      featured: false,
    },
    {
      name: 'Camisa Linho Bege',
      description: 'Camisa de linho em cor bege, fresca e elegante para dias quentes.',
      price: 149.90,
      image_url: '/products/camisa-linho.jpg',
      category: 'casual',
      stock: 40,
      featured: true,
    },
    {
      name: 'Camisa Xadrez Vermelha',
      description: 'Camisa xadrez em vermelho e preto, clássica e versátil.',
      price: 109.90,
      image_url: '/products/camisa-xadrez.jpg',
      category: 'casual',
      stock: 55,
      featured: false,
    },
    {
      name: 'Camisa Henley Cinza',
      description: 'Camisa estilo henley em cinza, casual e moderna.',
      price: 79.90,
      image_url: '/products/camisa-henley.jpg',
      category: 'casual',
      stock: 60,
      featured: false,
    },
    {
      name: 'Camisa Oxford Azul',
      description: 'Camisa oxford azul clássica, versátil para diversas ocasiões.',
      price: 119.90,
      image_url: '/products/camisa-oxford.jpg',
      category: 'social',
      stock: 70,
      featured: true,
    },
    {
      name: 'Camisa Flanela Verde',
      description: 'Camisa de flanela em tom verde, quente e confortável.',
      price: 99.90,
      image_url: '/products/camisa-flanela.jpg',
      category: 'casual',
      stock: 50,
      featured: false,
    },
    {
      name: 'Camisa Preta Básica',
      description: 'Camisa básica de algodão em cor preta, essencial para qualquer guarda-roupa.',
      price: 69.90,
      image_url: '/products/camisa-basica-preta.jpg',
      category: 'básica',
      stock: 90,
      featured: true,
    },
    {
      name: 'Camisa Manga Curta Listrada',
      description: 'Camisa de manga curta com listras, ideal para dias quentes.',
      price: 79.90,
      image_url: '/products/camisa-listrada.jpg',
      category: 'casual',
      stock: 65,
      featured: false,
    }
  ];
  
  // Inserir produtos no banco
  for (const product of products) {
    await createProduct({
      ...product,
      discount_percentage: 0,
      sales: 0,
      created_at: new Date().toISOString()
    });
  }
}
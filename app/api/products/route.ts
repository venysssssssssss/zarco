import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';
import { seedProducts } from '@/lib/db/productRepository';

export async function GET(request: Request) {
  try {
    // Inserir dados de seed se necessário
    await seedProducts();
    
    // Obter parâmetros da URL
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured') === 'true';
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
    
    let products;
    
    if (featured) {
      products = await productService.getFeaturedProducts(limit);
    } else if (category) {
      products = await productService.getProductsByCategory(category);
    } else {
      products = await productService.getAllProducts();
    }
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
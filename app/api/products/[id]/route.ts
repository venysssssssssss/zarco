import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const product = await productService.getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error(`Erro ao buscar produto ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}
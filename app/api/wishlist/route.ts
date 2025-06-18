import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { wishlistService } from '@/services/wishlistService';

export async function GET() {
  try {
    // Verificar autenticação
    const cookieStore = cookies();
    const userId = (await cookieStore).get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    // Buscar itens da wishlist do usuário
    const wishlistItems = await wishlistService.getWishlistItems(userId);
    
    return NextResponse.json({ items: wishlistItems });
  } catch (error) {
    console.error('Erro ao buscar wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const cookieStore = cookies();
    const userId = (await cookieStore).get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    // Obter dados da requisição
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }
    
    // Adicionar item à wishlist
    const result = await wishlistService.addItemToWishlist(userId, productId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Não foi possível adicionar o produto à lista de desejos' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item adicionado à lista de desejos',
      item: result
    });
  } catch (error) {
    console.error('Erro ao adicionar à wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar à wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Verificar autenticação
    const cookieStore = cookies();
    const userId = (await cookieStore).get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    // Obter ID do produto da URL
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }
    
    // Remover item da wishlist
    const success = await wishlistService.removeItemFromWishlist(userId, productId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Não foi possível remover o produto da lista de desejos' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Item removido da lista de desejos'
    });
  } catch (error) {
    console.error('Erro ao remover da wishlist:', error);
    return NextResponse.json(
      { error: 'Erro ao remover da wishlist' },
      { status: 500 }
    );
  }
}
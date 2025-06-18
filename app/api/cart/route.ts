import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartService } from '@/services/cartService';

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
    
    // Buscar itens do carrinho do usuário
    const cartItems = await cartService.getCartItems(userId);
    
    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar carrinho' },
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
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }
    
    // Adicionar item ao carrinho
    const result = await cartService.addItemToCart(userId, productId, quantity);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Não foi possível adicionar o produto ao carrinho' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item adicionado ao carrinho',
      item: result
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar ao carrinho' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const { productId, quantity } = await request.json();
    
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'ID do produto e quantidade são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Atualizar quantidade do item no carrinho
    const result = await cartService.updateItemQuantity(userId, productId, quantity);
    
    if (!result && quantity > 0) {
      return NextResponse.json(
        { error: 'Não foi possível atualizar o item no carrinho' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: quantity > 0 ? 'Item atualizado no carrinho' : 'Item removido do carrinho',
      item: result
    });
  } catch (error) {
    console.error('Erro ao atualizar item no carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar item no carrinho' },
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
    
    // Obter ID do produto da URL ou limpar carrinho
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const clearAll = url.searchParams.get('clear') === 'true';
    
    let success = false;
    
    if (clearAll) {
      // Limpar carrinho inteiro
      success = await cartService.clearCart(userId);
      
      return NextResponse.json({
        success,
        message: success ? 'Carrinho esvaziado com sucesso' : 'Não foi possível esvaziar o carrinho'
      });
    } else if (productId) {
      // Remover item específico
      success = await cartService.removeItem(userId, productId);
      
      return NextResponse.json({
        success,
        message: success ? 'Item removido do carrinho' : 'Não foi possível remover o item do carrinho'
      });
    } else {
      return NextResponse.json(
        { error: 'ID do produto ou parâmetro clear é obrigatório' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error);
    return NextResponse.json(
      { error: 'Erro ao remover do carrinho' },
      { status: 500 }
    );
  }
}
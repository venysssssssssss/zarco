import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/auth/utils';

export async function GET() {
  try {
    // Verificar se o usuário está autenticado
    const cookieStore = cookies();
    const userIdCookie = (await cookieStore).get('user_id');
    
    if (!userIdCookie) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    // Buscar informações do usuário a partir do ID
    const user = await getUserById(userIdCookie.value);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Retornar dados do usuário sem a senha
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
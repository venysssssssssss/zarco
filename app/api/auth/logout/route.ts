import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Limpar cookies de autenticação
    (await
          // Limpar cookies de autenticação
          cookieStore).set('user_id', '', {
      httpOnly: true,
      expires: new Date(0), // Data no passado para expirar imediatamente
      path: '/',
    });
    
    (await cookieStore).set('session_id', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
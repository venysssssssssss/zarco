import { validateCredentials } from '@/lib/auth/utils';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Validar credenciais
    const user = await validateCredentials(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Criar uma sessão
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // Armazenar sessão em cookies
    const cookieStore = cookies();
    
    // Cookie de usuário
    (await
          // Cookie de usuário
          cookieStore).set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });
    
    // Cookie de sessão
    (await
          // Cookie de sessão
          cookieStore).set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });
    
    // Retornar sucesso sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Erro de login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
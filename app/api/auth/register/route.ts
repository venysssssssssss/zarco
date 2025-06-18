import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/utils';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validar entradas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Criar usuário
    const user = await registerUser(name, email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 409 }
      );
    }
    
    // Retornar sucesso sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Erro de registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
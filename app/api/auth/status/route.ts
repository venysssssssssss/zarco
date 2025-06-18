import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userIdCookie = (await cookieStore).get('user_id');
    const sessionCookie = (await cookieStore).get('session_id');
    
    const isAuthenticated = !!userIdCookie && !!sessionCookie;
    
    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error('Erro ao verificar status de autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', isAuthenticated: false },
      { status: 500 }
    );
  }
}
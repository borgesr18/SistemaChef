// 📁 src/app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();

  // Remove o token de autenticação
  cookieStore.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });

  return NextResponse.json({ message: 'Logout realizado com sucesso' });
}

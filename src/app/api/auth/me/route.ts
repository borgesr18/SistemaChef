// 📁 src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    return NextResponse.json({
      id: (payload as any).id,
      nome: (payload as any).nome,
      email: (payload as any).email,
      role: (payload as any).role
    });
  } catch (error) {
    console.error('Erro ao buscar usuário autenticado:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllUsuarios } from '@/lib/serverUsuarios';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build' || (process.env.NODE_ENV === 'production' && !req.headers.get('host'))) {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    console.log('🔐 Checking authentication for /api/auth/users');
    
    await requireRole(req, ['admin']);
    
    console.log('✅ Authentication passed, fetching users');

    const usuarios = await getAllUsuarios();
    const list = usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      role: u.role,
    }));

    console.log(`✅ Returning ${list.length} users`);
    return NextResponse.json(list);
  } catch (error) {
    console.error('Users list error:', error);
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json({ error: 'Token de autenticação necessário' }, { status: 401 });
      }
      if (error.message === 'Insufficient permissions') {
        return NextResponse.json({ error: 'Permissões insuficientes' }, { status: 403 });
      }
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}


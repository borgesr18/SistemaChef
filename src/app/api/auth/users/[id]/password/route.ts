import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { hashSenha, senhaForte } from '@/lib/serverUsuarios';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireRole(req, ['admin']);
    
    const { novaSenha } = await req.json();
    
    if (!senhaForte(novaSenha)) {
      return NextResponse.json({ error: 'Senha fraca' }, { status: 400 });
    }
    
    const usuario = await prisma.usuario.update({
      where: { id: params.id },
      data: {
        senhaHash: hashSenha(novaSenha)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update password error:', error);
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Permissões insuficientes' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

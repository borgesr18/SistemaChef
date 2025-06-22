import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth(req);
    
    const movimentacoes = await prisma.estoqueProducaoMovimentacao.findMany({
      where: { userId: user.id },
      include: {
        ficha: true
      },
      orderBy: { data: 'desc' }
    });

    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error('Get estoque produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth(req);
    
    const data = await req.json();
    
    const movimentacao = await prisma.estoqueProducaoMovimentacao.create({
      data: {
        fichaId: data.fichaId,
        quantidade: data.quantidade,
        validade: data.validade,
        data: data.data ? new Date(data.data) : new Date(),
        tipo: data.tipo,
        userId: user.id
      },
      include: {
        ficha: true
      }
    });

    return NextResponse.json(movimentacao);
  } catch (error) {
    console.error('Create estoque produção movimentação error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

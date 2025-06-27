import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth(req);
    
    const movimentacoes = await prisma.estoqueMovimentacao.findMany({
      where: { userId: user.id },
      include: {
        produto: true
      },
      orderBy: { data: 'desc' }
    });

    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error('Get estoque error:', error);
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
    
    const movimentacao = await prisma.estoqueMovimentacao.create({
      data: {
        produtoId: data.produtoId,
        quantidade: data.quantidade,
        preco: data.preco,
        fornecedor: data.fornecedor,
        marca: data.marca,
        data: data.data ? new Date(data.data) : new Date(),
        tipo: data.tipo,
        userId: user.id
      },
      include: {
        produto: true
      }
    });

    return NextResponse.json(movimentacao);
  } catch (error) {
    console.error('Create estoque movimentação error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

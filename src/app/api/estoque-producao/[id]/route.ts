import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    
    const data = await req.json();
    
    const movimentacao = await prisma.estoqueProducaoMovimentacao.update({
      where: { 
        id: params.id,
        userId: user.id 
      },
      data: {
        fichaId: data.fichaId,
        quantidade: data.quantidade,
        validade: data.validade,
        data: data.data ? new Date(data.data) : undefined,
        tipo: data.tipo
      },
      include: {
        ficha: {
          include: {
            categoriaRef: true
          }
        }
      }
    });

    return NextResponse.json(movimentacao);
  } catch (error) {
    console.error('Update estoque produção movimentação error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(req);
    
    await prisma.estoqueProducaoMovimentacao.delete({
      where: { 
        id: params.id,
        userId: user.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete estoque produção movimentação error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

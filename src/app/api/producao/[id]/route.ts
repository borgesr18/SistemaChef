import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth(req);
    
    const data = await req.json();
    
    const producao = await prisma.producao.update({
      where: { 
        id: params.id,
        userId: user.id 
      },
      data: {
        fichaId: data.fichaId,
        quantidadeTotal: data.quantidadeTotal,
        unidadeQuantidade: data.unidadeQuantidade,
        pesoUnitario: data.pesoUnitario,
        unidadePeso: data.unidadePeso,
        unidadesGeradas: data.unidadesGeradas,
        custoTotal: data.custoTotal,
        custoUnitario: data.custoUnitario,
        validade: data.validade,
        data: data.data ? new Date(data.data) : undefined
      },
      include: {
        ficha: {
          include: {
            categoriaRef: true,
            ingredientes: {
              include: {
                produto: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(producao);
  } catch (error) {
    console.error('Update produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth(req);
    
    await prisma.producao.delete({
      where: { 
        id: params.id,
        userId: user.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

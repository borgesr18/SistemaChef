import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth();
    
    const data = await req.json();
    
    const preco = await prisma.precoVenda.update({
      where: { 
        id: params.id,
        userId: user.id 
      },
      data: {
        producaoId: data.producaoId,
        fichaId: data.fichaId,
        custoUnitario: data.custoUnitario,
        lucro1: data.lucro1,
        preco1: data.preco1,
        lucro2: data.lucro2,
        preco2: data.preco2,
        lucro3: data.lucro3,
        preco3: data.preco3
      },
      include: {
        producao: {
          include: {
            ficha: true
          }
        }
      }
    });

    return NextResponse.json(preco);
  } catch (error) {
    console.error('Update preço error:', error);
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

    const user = await requireAuth();
    
    await prisma.precoVenda.delete({
      where: { 
        id: params.id,
        userId: user.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete preço error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

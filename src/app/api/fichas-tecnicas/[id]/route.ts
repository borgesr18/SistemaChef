import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth(req);
    
    const fichaTecnica = await prisma.fichaTecnica.findFirst({
      where: { 
        id: params.id,
        userId: user.id 
      },
      include: {
        categoriaRef: true,
        ingredientes: {
          include: {
            produto: {
              include: {
                categoriaRef: true,
                unidadeRef: true
              }
            }
          }
        }
      }
    });

    if (!fichaTecnica) {
      return NextResponse.json({ error: 'Ficha técnica não encontrada' }, { status: 404 });
    }

    return NextResponse.json(fichaTecnica);
  } catch (error) {
    console.error('Get ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth(req);
    
    const data = await req.json();
    
    await prisma.ingredienteFicha.deleteMany({
      where: { fichaId: params.id }
    });
    
    const fichaTecnica = await prisma.fichaTecnica.update({
      where: { 
        id: params.id,
        userId: user.id 
      },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        modoPreparo: data.modoPreparo,
        tempoPreparo: data.tempoPreparo,
        rendimentoTotal: data.rendimentoTotal,
        unidadeRendimento: data.unidadeRendimento,
        custoTotal: data.custoTotal || 0,
        custoPorcao: data.custoPorcao || 0,
        observacoes: data.observacoes,
        ingredientes: {
          create: data.ingredientes?.map((ing: any) => ({
            produtoId: ing.produtoId,
            quantidade: ing.quantidade,
            unidade: ing.unidade,
            custo: ing.custo || 0
          })) || []
        }
      },
      include: {
        categoriaRef: true,
        ingredientes: {
          include: {
            produto: {
              include: {
                categoriaRef: true,
                unidadeRef: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(fichaTecnica);
  } catch (error) {
    console.error('Update ficha técnica error:', error);
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
    
    await prisma.fichaTecnica.delete({
      where: { 
        id: params.id,
        userId: user.id 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

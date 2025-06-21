import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth(req);
    
    const fichasTecnicas = await prisma.fichaTecnica.findMany({
      where: { userId: user.id },
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
      },
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(fichasTecnicas);
  } catch (error) {
    console.error('Get fichas técnicas error:', error);
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
    
    const fichaTecnica = await prisma.fichaTecnica.create({
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
        userId: user.id,
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
    console.error('Create ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

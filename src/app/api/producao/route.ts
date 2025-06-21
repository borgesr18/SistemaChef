import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    const producoes = await prisma.producao.findMany({
      where: { userId: user.id },
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
      },
      orderBy: { data: 'desc' }
    });

    return NextResponse.json(producoes);
  } catch (error) {
    console.error('Get produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    const data = await req.json();
    
    const producao = await prisma.producao.create({
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
        data: data.data ? new Date(data.data) : new Date(),
        userId: user.id
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
    console.error('Create produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

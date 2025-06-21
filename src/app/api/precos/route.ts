import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    const precos = await prisma.precoVenda.findMany({
      where: { userId: user.id },
      include: {
        producao: {
          include: {
            ficha: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(precos);
  } catch (error) {
    console.error('Get preços error:', error);
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
    
    const preco = await prisma.precoVenda.create({
      data: {
        producaoId: data.producaoId,
        fichaId: data.fichaId,
        custoUnitario: data.custoUnitario,
        lucro1: data.lucro1,
        preco1: data.preco1,
        lucro2: data.lucro2,
        preco2: data.preco2,
        lucro3: data.lucro3,
        preco3: data.preco3,
        userId: user.id
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
    console.error('Create preço error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

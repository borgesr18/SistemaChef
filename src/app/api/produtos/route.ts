import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireAuth(req);
    
    const produtos = await prisma.produto.findMany({
      include: {
        categoriaRef: true,
        unidadeRef: true
      },
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Get produtos error:', error);
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
    
    await requireAuth(req);
    
    const data = await req.json();
    
    const produto = await prisma.produto.create({
      data: {
        nome: data.nome,
        categoria: data.categoria,
        marca: data.marca,
        unidadeMedida: data.unidadeMedida,
        preco: data.preco,
        precoUnitario: data.precoUnitario,
        fornecedor: data.fornecedor,
        pesoEmbalagem: data.pesoEmbalagem,
        infoNutricional: data.infoNutricional
      },
      include: {
        categoriaRef: true,
        unidadeRef: true
      }
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Create produto error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

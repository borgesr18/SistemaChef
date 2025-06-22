import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireAuth(req);
    
    const categorias = await prisma.categoriaReceita.findMany({
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Get categorias receitas error:', error);
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
    
    const { nome } = await req.json();
    
    const categoria = await prisma.categoriaReceita.create({
      data: { nome }
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Create categoria receita error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
  }
  
  try {
    await requireAuth();
    
    const unidades = await prisma.unidade.findMany({
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(unidades);
  } catch (error) {
    console.error('Get unidades error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
  }
  
  try {
    await requireAuth();
    
    const { id, nome } = await req.json();
    
    const unidade = await prisma.unidade.create({
      data: { id, nome }
    });

    return NextResponse.json(unidade);
  } catch (error) {
    console.error('Create unidade error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireAuth(req);
    
    const categoria = await prisma.categoriaReceita.findUnique({
      where: { id: params.id }
    });

    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Get categoria receita error:', error);
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
    
    await requireAuth(req);
    
    const { nome } = await req.json();
    
    const categoria = await prisma.categoriaReceita.update({
      where: { id: params.id },
      data: { nome }
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Update categoria receita error:', error);
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
    
    await requireAuth(req);
    
    await prisma.categoriaReceita.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    console.error('Delete categoria receita error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// src/app/api/categorias-insumos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const categorias = await prisma.categoriaInsumo.findMany({
      where: { userId: user.id },
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias de insumos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const novaCategoria = await prisma.categoriaInsumo.create({
      data: {
        nome: body.nome,
        userId: user.id
      }
    });

    return NextResponse.json(novaCategoria);
  } catch (error) {
    console.error('Erro ao criar categoria de insumo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const categoriaAtualizada = await prisma.categoriaInsumo.update({
      where: {
        id: body.id,
        userId: user.id
      },
      data: {
        nome: body.nome
      }
    });

    return NextResponse.json(categoriaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar categoria de insumo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { id } = await req.json();

    await prisma.categoriaInsumo.delete({
      where: {
        id,
        userId: user.id
      }
    });

    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria de insumo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

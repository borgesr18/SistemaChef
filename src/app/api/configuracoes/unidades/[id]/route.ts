// 📁 src/app/api/configuracoes/unidades/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);

    const { id } = params;
    const { nome, sigla } = await req.json();

    if (!nome || !sigla) {
      return NextResponse.json({ error: 'Nome e sigla são obrigatórios' }, { status: 400 });
    }

    const unidade = await prisma.unidade.update({
      where: { id },
      data: { nome, sigla },
    });

    return NextResponse.json(unidade);
  } catch (error) {
    console.error('Erro ao atualizar unidade:', error);
    return NextResponse.json({ error: 'Erro ao atualizar unidade' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);

    const { id } = params;

    await prisma.unidade.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir unidade:', error);
    return NextResponse.json({ error: 'Erro ao excluir unidade' }, { status: 500 });
  }
}




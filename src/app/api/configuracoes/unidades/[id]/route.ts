// 📁 src/app/api/configuracoes/unidades/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);

    const id = params.id;

    const unidadeExistente = await prisma.unidade.findUnique({
      where: { id },
    });

    if (!unidadeExistente) {
      return NextResponse.json({ error: 'Unidade não encontrada' }, { status: 404 });
    }

    await prisma.unidade.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Unidade excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir unidade de medida:', error);
    return NextResponse.json({ error: 'Erro ao excluir unidade' }, { status: 500 });
  }
}



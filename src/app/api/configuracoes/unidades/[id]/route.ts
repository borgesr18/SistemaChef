// src/app/api/configuracoes/unidades/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await prisma.unidade.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir unidade:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// Correção sugerida para useEffect no ConfiguracoesLayout.tsx
useEffect(() => {
  async function carregarCategorias() {
    try {
      const res = await apiClient.get("/api/configuracoes/categorias-insumos");
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Resposta inválida da API');
      setCategorias(json);
    } catch (err: any) {
      setErro("Erro ao carregar categorias");
    } finally {
      setCarregando(false);
    }
  }
  carregarCategorias();
}, []);

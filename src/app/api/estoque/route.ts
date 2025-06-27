// app/api/estoque/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);

    const movimentacoes = await prisma.estoqueMovimentacao.findMany({
      where: {
        userId: user.id,
      },
      include: {
        produto: {
          select: {
            nome: true,
            unidadeMedida: true,
            preco: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });

    return NextResponse.json({ movimentacoes });
  } catch (error) {
    console.error("Erro na API /api/estoque:", error);
    return new NextResponse("Erro ao buscar movimentações", { status: 500 });
  }
}

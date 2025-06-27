import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { user } = await requireAuth(req);

    const movimentacoes = await prisma.estoqueMovimentacao.findMany({
      where: {
        userId: user.id,
      },
      include: {
        produto: true,
      },
      orderBy: {
        data: "desc",
      },
    });

    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    return new NextResponse("Erro ao buscar movimentações", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await requireAuth(req);
    const body = await req.json();

    const novaMovimentacao = await prisma.estoqueMovimentacao.create({
      data: {
        produtoId: body.produtoId,
        quantidade: body.quantidade,
        preco: body.preco,
        fornecedor: body.fornecedor,
        marca: body.marca,
        data: new Date(body.data),
        tipo: body.tipo,
        userId: user.id,
      },
    });

    return NextResponse.json(novaMovimentacao);
  } catch (error) {
    console.error("Erro ao criar movimentação:", error);
    return new NextResponse("Erro ao criar movimentação", { status: 500 });
  }
}


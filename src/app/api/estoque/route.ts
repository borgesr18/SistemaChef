import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const supabase = createClient();
    const { data: movimentacoes, error } = await supabase
      .from("estoque_movimentacoes")
      .select("*, produto:produtos(*)")
      .eq("user_id", user.id)
      .order("data", { ascending: false });

    if (error) throw error;

    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    return new NextResponse("Erro ao buscar movimentações", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const supabase = createClient();
    const { data: novaMovimentacao, error } = await supabase
      .from("estoque_movimentacoes")
      .insert({
        produto_id: body.produtoId,
        quantidade: body.quantidade,
        preco: body.preco,
        fornecedor: body.fornecedor,
        marca: body.marca,
        data: body.data || new Date().toISOString(),
        tipo: body.tipo,
        user_id: user.id,
      })
      .select("*, produto:produtos(*)")
      .single();

    if (error) throw error;

    return NextResponse.json(novaMovimentacao);
  } catch (error) {
    console.error("Erro ao criar movimentação:", error);
    return new NextResponse("Erro ao criar movimentação", { status: 500 });
  }
}


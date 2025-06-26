// src/app/api/configuracoes/unidades/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-browser';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const { nome, sigla } = await req.json();

  const { data, error } = await supabase
    .from('unidades')
    .update({ nome, sigla })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

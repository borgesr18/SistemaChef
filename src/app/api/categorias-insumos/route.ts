import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookies() }
  );

  const { data, error } = await supabase
    .from('categorias_insumos')
    .select('*')
    .order('nome', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nome } = body;

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookies() }
  );

  const { error } = await supabase
    .from('categorias_insumos')
    .insert({ nome });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sucesso: true });
}

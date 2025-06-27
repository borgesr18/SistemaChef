//src/app/api/configuracoes/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const supabase = createClient();
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, role, criado_em')
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const data = await req.json();

    const supabase = createClient();
    const { data: novoUsuario, error } = await supabase
      .from('usuarios')
      .insert({
        nome: data.nome,
        email: data.email,
        role: data.role || 'usuario',
      })
      .single();

    if (error) throw error;

    return NextResponse.json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}

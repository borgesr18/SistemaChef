// src/app/api/auth/users/route.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      );
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis_usuarios')
      .select('papel')
      .eq('id_usuario', user.id)
      .single();

    if (perfilError || !perfil || perfil.papel !== 'admin') {
      return NextResponse.json(
        { error: 'Permissões insuficientes' },
        { status: 403 }
      );
    }

    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');

    if (usuariosError) {
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      );
    }

    return NextResponse.json(usuarios);
  } catch (error: any) {
    console.error('Erro interno do servidor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}


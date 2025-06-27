// src/app/api/auth/users/route.ts
import { NextResponse } from 'next/server';
import { supabase, requireRole } from '@/lib/authServer';

export async function GET() {
  try {
    // Verifica se o usuário tem permissão de administrador
    await requireRole('admin');

    const supabaseClient = supabase();
    const { data: usuarios, error } = await supabaseClient
      .from('usuarios')
      .select('id, nome, email, perfil');

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      );
    }

    return NextResponse.json(usuarios);
  } catch (error: any) {
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { error: 'Token de autenticação necessário' },
          { status: 401 }
        );
      }
      if (error.message === 'Insufficient permissions') {
        return NextResponse.json(
          { error: 'Permissões insuficientes' },
          { status: 403 }
        );
      }
    }

    console.error('Erro interno do servidor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



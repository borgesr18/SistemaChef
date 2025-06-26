// 📁 src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-browser';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type Database } from '@/lib/database.types';

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();

  try {
    const cookieStore = cookies();
    const supabaseServer = createServerClient<Database>({
      cookies: () => cookieStore,
    });

    const { error, data } = await supabaseServer.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.error('Erro no login:', error.message);
      return NextResponse.json({ erro: 'Usuário ou senha inválidos' }, { status: 401 });
    }

    const { user, session } = data;

    return NextResponse.json({
      usuario: {
        id: user?.id,
        email: user?.email,
        nome: user?.user_metadata?.nome || '',
      },
      token: session?.access_token,
    });
  } catch (err) {
    console.error('Erro interno ao fazer login:', err);
    return NextResponse.json({ erro: 'Erro interno do servidor' }, { status: 500 });
  }
}

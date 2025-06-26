// lib/auth.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import { NextRequest } from 'next/server';

export async function requireAuth(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) throw new Error('Authentication required');

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cookies: () => cookies(),
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Erro ao obter usuário:', error);
    throw new Error('Authentication required');
  }

  return user;
}

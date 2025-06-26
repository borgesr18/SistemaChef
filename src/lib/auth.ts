// src/lib/auth.ts
// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Certifique-se de gerar esse tipo com o CLI ou manualmente

// Server Component: usado em rotas API, SSR, layouts, etc.
export function getServerSupabaseClient(): SupabaseClient<Database> {
  return createServerComponentClient<Database>({ cookies });
}

// Client Component: usado em componentes com 'use client' (se necessário)
export function getClientSupabase(): SupabaseClient<Database> {
  return createBrowserClient<Database>();
}

// Função para exigir permissão mínima (server-side)
export async function requireRole(role: string) {
  const supabase = getServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Authentication required');
  }

  const { data: perfil, error: perfilError } = await supabase
    .from('perfis_usuarios')
    .select('papel')
    .eq('id_usuario', user.id)
    .single();

  if (perfilError || !perfil) {
    throw new Error('Perfil do usuário não encontrado');
  }

  if (perfil.papel !== role && perfil.papel !== 'admin') {
    throw new Error('Insufficient permissions');
  }

  return user;
}

// src/lib/authServer.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const supabase = () => createServerComponentClient({ cookies });

export async function requireRole(role: string) {
  const supabaseClient = supabase();
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) throw new Error('Authentication required');
  const { data, error } = await supabaseClient
    .from('perfis_usuarios')
    .select('perfil')
    .eq('id', user.id)
    .single();

  if (error || !data || data.perfil !== role) {
    throw new Error('Insufficient permissions');
  }

  return user;
}

// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Verifica se o usuário autenticado possui o papel exigido.
 * Redireciona para login se não estiver autenticado ou autorizado.
 */
export async function requireRole(role: string) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect('/login');
  }

  const { data: perfil } = await supabase
    .from('perfis_usuarios')
    .select('papel')
    .eq('id_usuario', user.id)
    .single();

  if (!perfil || perfil.papel !== role) {
    return redirect('/nao-autorizado');
  }

  return user;
}

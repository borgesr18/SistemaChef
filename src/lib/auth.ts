// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

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

/**
 * Gera um token JWT para o usuário
 */
export function signToken(payload: any) {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '4h' });
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createMiddlewareClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function signToken(payload: object) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '4h' });
}

export function verifyToken(token: string) {
  try {
    if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

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

export async function requireAuth(_req: NextRequest) {
  const supabase = createMiddlewareClient<Database>({ cookies })
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Authentication required')
  }

  return user
}

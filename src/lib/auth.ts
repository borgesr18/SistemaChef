// src/lib/auth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function requireRole(role: string) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.role !== role) {
    throw new Error('Acesso negado');
  }

  return session.user;
}

export async function signToken(payload: object) {
  // Simulação da geração de token
  return JSON.stringify(payload);
}

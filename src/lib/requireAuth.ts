// lib/requireAuth.ts
import { cookies } from 'next/headers'
import { createClient } from './supabase-server'

export async function requireAuth() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Authentication required');
  }

  return session.user;
}

// lib/requireAuth.ts
import { cookies } from 'next/headers'
import { createClient } from './supabase-server'
import { verifyToken } from './auth'

export async function requireAuth() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return session.user
  }

  // fallback to custom JWT if Supabase session is missing
  const token = cookies().get('token')?.value
  if (token) {
    const payload = verifyToken(token)
    if (payload && typeof payload === 'object' && 'id' in payload) {
      return payload as any
    }
  }

  throw new Error('Authentication required')
}

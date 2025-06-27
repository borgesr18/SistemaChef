// 📁 src/app/api/auth/login/route.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  })

  if (error || !data.user) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  const user = data.user

  const token = signToken({
    id: user.id,
    nome: user.user_metadata?.nome,
    email: user.email,
    role: user.user_metadata?.role,
  })

  cookies().set('token', token, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 4, // 4 horas
  });

  return NextResponse.json({
    id: user.id,
    nome: user.user_metadata?.nome,
    email: user.email,
    role: user.user_metadata?.role,
  })
}

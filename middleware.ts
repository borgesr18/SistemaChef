// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from './lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient<Database>({ req, res })

  // Revalida a sessão do usuário com base no cookie
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redireciona para login se não estiver autenticado
  if (!session && req.nextUrl.pathname.startsWith('/configuracoes')) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Define as rotas que usam o middleware
export const config = {
  matcher: [
    '/configuracoes/:path*',
    '/dashboard/:path*',
    '/fichas-tecnicas/:path*',
    '/estoque/:path*',
    '/produtos/:path*',
    '/usuarios/:path*',
  ],
}

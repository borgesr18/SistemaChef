// /middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value

  // Se não estiver autenticado e tentando acessar uma rota protegida
  const protectedPaths = ['/', '/produtos', '/fichas-tecnicas', '/relatorios', '/configuracoes']
  const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configuração de quais rotas o middleware deve monitorar
export const config = {
  matcher: ['/((?!_next|api|login|public|usuarios/novo).*)'],
}

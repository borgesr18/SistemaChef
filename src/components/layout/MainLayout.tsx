'use client';

import React, { ReactNode, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUsuarios } from '@/lib/usuariosService';
import { useRouter, usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { usuarioAtual } = useUsuarios();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!usuarioAtual && pathname !== '/login' && pathname !== '/usuarios/novo') {
      router.push('/login');
    }
    if (usuarioAtual && (pathname === '/login' || pathname === '/usuarios/novo')) {
      router.push('/');
    }
  }, [usuarioAtual, pathname, router]);

  const hideLayout =
    pathname === '/login' ||
    pathname === '/usuarios/novo' ||
    pathname.includes('/imprimir');

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--cor-fundo)' }}>
      {!hideLayout && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {!hideLayout && <Header />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        {!hideLayout && (
          <footer className="p-4 text-center text-sm border-t" style={{ backgroundColor: 'white', color: 'var(--cor-texto-secundario)', borderColor: 'var(--cor-borda)' }}>
            CustoChef &copy; {new Date().getFullYear()}
          </footer>
        )}
      </div>
    </div>
  );
};

export default MainLayout;

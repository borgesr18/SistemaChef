'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useUsuarios } from '@/lib/usuariosService';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const { usuarioAtual, logout, isLoading } = useUsuarios();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsProfileOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setIsProfileOpen(false), 200);
  };

  const closeProfile = () => setIsProfileOpen(false);

  if (isLoading) return null; // ou um Spinner, se preferir

  return (
    <header
      className="border-b shadow-sm"
      style={{
        backgroundColor: 'var(--cor-primaria)',
        color: 'white',
        borderColor: 'var(--cor-borda)',
      }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Logo className="text-xl" />
          <span className="text-xs sm:text-sm whitespace-nowrap">
            - Sistema de Fichas Técnicas
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {usuarioAtual?.nome?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-white">
                {usuarioAtual?.nome || 'Usuário'}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/configuracoes/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Perfil
                </Link>
                <Link
                  href="/configuracoes"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configurações
                </Link>
                <div className="border-t" style={{ borderColor: 'var(--cor-borda)' }}></div>
                <button
                  onClick={() => {
                    logout();
                    closeProfile();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


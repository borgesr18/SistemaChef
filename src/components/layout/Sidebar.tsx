'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '../ui/Logo';

type MenuItem = {
  href: string;
  icon: string;
  label: string;
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const menuItems: MenuItem[] = [
    { href: '/', icon: 'dashboard', label: 'Dashboard' },
    { href: '/fichas-tecnicas', icon: 'receipt', label: 'Fichas Técnicas' },
    { href: '/produtos', icon: 'inventory', label: 'Insumos' },
    { href: '/estoque', icon: 'store', label: 'Estoque de Insumos' },
    { href: '/producao', icon: 'factory', label: 'Produção' },
    { href: '/estoque-producao', icon: 'warehouse', label: 'Estoque de Produção' },
    { href: '/precos', icon: 'attach_money', label: 'Preços de Venda' },
    { href: '/relatorios', icon: 'bar_chart', label: 'Relatórios' },
    { href: '/configuracoes', icon: 'settings', label: 'Configurações' },
  ];

  return (
    <aside
      className={`text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}
      style={{ backgroundColor: 'var(--cor-primaria)' }}
    >
      {/* Topo com logo e botão de colapso */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <Logo className="text-xl" showTagline={false} />}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[var(--cor-secundaria)] focus:outline-none"
          aria-label="Alternar menu lateral"
          aria-expanded={!isCollapsed}
        >
          <span className="material-icons">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Menu de navegação */}
      <nav className="mt-4 flex-1">
        <ul>
          {menuItems.map(({ href, icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center px-4 py-3 hover:bg-[var(--cor-secundaria)] transition-colors"
              >
                <span className="material-icons mr-3">{icon}</span>
                {!isCollapsed && <span className="text-sm">{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

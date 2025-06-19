'use client';

import { ReactNode } from 'react';
import Tabs from '@/components/ui/Tabs';

import UsuariosConfigPage from './usuarios/page';
import CategoriasConfigPage from './categorias/page';
import CategoriasReceitasConfigPage from './categorias-receitas/page';
import UnidadesConfigPage from './unidades/page';

type TabConfig = {
  id: string;
  label: string;
  content: ReactNode;
};

export default function ConfiguracoesPage() {
  const tabs: TabConfig[] = [
    { id: 'usuarios', label: 'Usuários', content: <UsuariosConfigPage /> },
    { id: 'categorias', label: 'Categorias de Produtos', content: <CategoriasConfigPage /> },
    { id: 'categorias-receitas', label: 'Categorias de Receitas', content: <CategoriasReceitasConfigPage /> },
    { id: 'unidades', label: 'Unidades de Medida', content: <UnidadesConfigPage /> },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      <Tabs tabs={tabs} />
    </div>
  );
}

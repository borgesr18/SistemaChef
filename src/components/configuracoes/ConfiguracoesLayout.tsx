'use client';

import React from 'react';
import { User } from '@supabase/supabase-js';
import Card from '@/components/ui/Card';

export default function ConfiguracoesLayout({ user }: { user: User | null }) {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>

      {/* Informações do Usuário */}
      <Card title="Usuário Autenticado">
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </Card>

      {/* Cadastro de Usuários */}
      <Card title="Gerenciar Usuários">
        <p className="text-gray-600 mb-2">Aqui você pode visualizar, adicionar ou remover usuários do sistema.</p>
        {/* Aqui pode ser adicionado um componente de tabela ou lista de usuários futuramente */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Novo Usuário
        </button>
      </Card>

      {/* Categorias de Insumos */}
      <Card title="Categorias de Insumos">
        <p className="text-gray-600 mb-2">Gerencie as categorias dos insumos utilizados nas fichas técnicas.</p>
        {/* Componente de lista ou formulário pode ser embutido aqui */}
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          + Nova Categoria de Insumo
        </button>
      </Card>

      {/* Categorias de Receitas */}
      <Card title="Categorias de Receitas">
        <p className="text-gray-600 mb-2">Organize suas receitas por categoria.</p>
        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          + Nova Categoria de Receita
        </button>
      </Card>

      {/* Unidades de Medida */}
      <Card title="Unidades de Medida">
        <p className="text-gray-600 mb-2">Defina as unidades padrão usadas nas fichas técnicas (ex: g, ml, unidade).</p>
        <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
          + Nova Unidade de Medida
        </button>
      </Card>
    </div>
  );
}

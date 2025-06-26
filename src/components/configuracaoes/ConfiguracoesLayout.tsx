'use client';

import React from 'react';

interface ConfiguracoesLayoutProps {
  user: {
    id: string;
    email: string;
    // outros campos que você quiser usar
  };
}

const ConfiguracoesLayout: React.FC<ConfiguracoesLayoutProps> = ({ user }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Configurações do Usuário</h1>
      <p className="mt-4 text-gray-700">Email: {user.email}</p>
    </div>
  );
};

export default ConfiguracoesLayout;

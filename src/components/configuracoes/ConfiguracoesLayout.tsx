'use client';
 
import React from 'react';

interface ConfiguracoesLayoutProps {
  user: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

const ConfiguracoesLayout: React.FC<ConfiguracoesLayoutProps> = ({ user }) => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Configurações do Usuário</h1>
      <div className="bg-white shadow rounded p-4">
        <p className="text-gray-700"><strong>ID:</strong> {user.id}</p>
        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        {/* Você pode adicionar mais dados aqui */}
      </div>
    </div>
  );
};

export default ConfiguracoesLayout;

//src/components/configuracoes/UsuariosSistema.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  funcao?: string;
  criadoEm: string;
}

export default function UsuariosSistema() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const res = await apiClient.get('/api/configuracoes/usuarios');
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Formato inválido');
        setUsuarios(json);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        setErro('Erro ao carregar usuários');
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, []);

  const adicionarUsuario = async () => {
    if (!email.trim() || !nome.trim()) return;

    try {
      const res = await apiClient.post('/api/configuracoes/usuarios', {
        email,
        nome,
        funcao,
      });

      const novo = await res.json();
      setUsuarios((prev) => [...prev, novo]);
      setEmail('');
      setNome('');
      setFuncao('');
    } catch (err) {
      console.error('Erro ao adicionar usuário:', err);
      alert('Erro ao adicionar usuário');
    }
  };

  const excluirUsuario = async (id: string) => {
    try {
      await apiClient.delete(`/api/configuracoes/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Erro ao excluir usuário');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Usuários do Sistema</h2>

      <div className="flex flex-wrap gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border px-3 py-2 rounded w-[250px]"
        />
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          className="border px-3 py-2 rounded w-[250px]"
        />
        <input
          type="text"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
          placeholder="Função (opcional)"
          className="border px-3 py-2 rounded w-[200px]"
        />
        <button
          onClick={adicionarUsuario}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p className="text-red-600">{erro}</p>
      ) : (
        <ul className="divide-y">
          {usuarios.map((u) => (
            <li key={u.id} className="py-2 flex justify-between items-center">
              <div>
                <strong>{u.nome}</strong> — {u.email}
                {u.funcao && <span className="ml-2 text-sm text-gray-500">({u.funcao})</span>}
              </div>
              <button
                onClick={() => excluirUsuario(u.id)}
                className="text-red-500 text-sm"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

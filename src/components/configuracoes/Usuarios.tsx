src/components/configuracoes/Usuarios.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '' });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const res = await apiClient.get('/api/usuarios');
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Resposta inválida');
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
    const { nome, email, senha } = novoUsuario;
    if (!nome || !email || !senha) return alert('Preencha todos os campos');

    try {
      const res = await apiClient.post('/api/usuarios', { nome, email, senha });
      const criado = await res.json();
      setUsuarios((prev) => [...prev, criado]);
      setNovoUsuario({ nome: '', email: '', senha: '' });
    } catch (err) {
      alert('Erro ao adicionar usuário');
    }
  };

  const excluirUsuario = async (id: string) => {
    try {
      await apiClient.delete(`/api/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Erro ao excluir usuário');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Usuários do Sistema</h2>

      <div className="grid gap-2 sm:grid-cols-3">
        <input
          type="text"
          value={novoUsuario.nome}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
          placeholder="Nome"
          className="border px-3 py-2 rounded"
        />
        <input
          type="email"
          value={novoUsuario.email}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
          placeholder="E-mail"
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          value={novoUsuario.senha}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
          placeholder="Senha"
          className="border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={adicionarUsuario}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Adicionar
      </button>

      {carregando ? (
        <p>Carregando usuários...</p>
      ) : erro ? (
        <p className="text-red-600">{erro}</p>
      ) : (
        <ul className="divide-y">
          {usuarios.map((usuario) => (
            <li key={usuario.id} className="py-2 flex justify-between items-center">
              <span>{usuario.nome} ({usuario.email})</span>
              <button
                onClick={() => excluirUsuario(usuario.id)}
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

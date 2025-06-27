// src/app/configuracoes/usuarios/page.tsx
'use client';

import React, { useState } from 'react';
import { useUsuarios } from '@/lib/usuariosService';

const PageUsuarios = () => {
  const {
    usuarios,
    registrarUsuario,
    editarUsuario,
    removerUsuario,
    isLoading,
  } = useUsuarios();

  const [novo, setNovo] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', role: 'viewer' });

  const resetForm = () => {
    setForm({ nome: '', email: '', senha: '', role: 'viewer' });
    setNovo(false);
    setEditandoId(null);
  };

  const handleSubmit = async () => {
    if (editandoId !== null) {
      await editarUsuario(editandoId, { nome: form.nome, role: form.role as any });
    } else {
      await registrarUsuario({ nome: form.nome, email: form.email, senha: form.senha, role: form.role as any });
    }
    resetForm();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Usuários</h1>

      <button
        onClick={() => setNovo(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Novo Usuário
      </button>

      {(novo || editandoId !== null) && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 rounded"
              disabled={editandoId !== null}
            />
            {!editandoId && (
              <input
                placeholder="Senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                type="password"
                className="border p-2 rounded"
              />
            )}
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="viewer">Visualizador</option>
              <option value="manager">Gerente</option>
            </select>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Nome</th>
            <th className="p-2">Email</th>
            <th className="p-2">Papel</th>
            <th className="p-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.nome}</td>
              <td className="p-2">{u.user_id}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 text-right space-x-2">
                <button
                  onClick={() => {
                    setEditandoId(u.id);
                    setForm({ nome: u.nome, email: '', senha: '', role: u.role });
                  }}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => removerUsuario(u.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageUsuarios;

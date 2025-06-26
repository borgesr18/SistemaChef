// src/app/configuracoes/categorias-insumos/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchCategorias, adicionarCategoria, atualizarCategoria, excluirCategoria } from '@/lib/categoriasInsumosService';

export default function CategoriasInsumosPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoNome, setEditandoNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const carregarCategorias = async () => {
    try {
      const lista = await fetchCategorias();
      setCategorias(lista);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const salvarNovaCategoria = async () => {
    if (!novaCategoria.trim()) return;
    await adicionarCategoria(novaCategoria);
    setNovaCategoria('');
    carregarCategorias();
  };

  const salvarEdicao = async () => {
    if (editandoId === null || !editandoNome.trim()) return;
    await atualizarCategoria(editandoId, editandoNome);
    setEditandoId(null);
    setEditandoNome('');
    carregarCategorias();
  };

  const removerCategoria = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await excluirCategoria(id);
      carregarCategorias();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categorias de Insumos</h1>

      {erro && <p className="text-red-600 mb-4">Erro: {erro}</p>}

      <div className="flex items-center mb-6 space-x-2">
        <input
          type="text"
          placeholder="Nova categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={salvarNovaCategoria}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Nome</th>
            <th className="border p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td className="border p-2">{cat.id}</td>
              <td className="border p-2">
                {editandoId === cat.id ? (
                  <input
                    value={editandoNome}
                    onChange={(e) => setEditandoNome(e.target.value)}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  cat.nome
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editandoId === cat.id ? (
                  <button
                    onClick={salvarEdicao}
                    className="text-blue-600 hover:underline"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditandoId(cat.id);
                      setEditandoNome(cat.nome);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() => removerCategoria(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {categorias.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                Nenhuma categoria cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

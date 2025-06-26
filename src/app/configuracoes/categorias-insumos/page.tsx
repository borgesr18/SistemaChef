// src/app/configuracoes/categorias-insumos/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  listarCategoriasInsumos,
  criarCategoriaInsumo,
  atualizarCategoriaInsumo,
  excluirCategoriaInsumo,
} from '@/lib/categoriasInsumosService';

export default function CategoriasInsumosPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const carregarCategorias = async () => {
    setCarregando(true);
    const lista = await listarCategoriasInsumos();
    setCategorias(lista);
    setCarregando(false);
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSalvar = async () => {
    try {
      if (!nome.trim()) return;
      if (editandoId) {
        await atualizarCategoriaInsumo(editandoId, nome);
      } else {
        await criarCategoriaInsumo(nome);
      }
      setNome('');
      setEditandoId(null);
      carregarCategorias();
    } catch (err: any) {
      setErro(err.message);
    }
  };

  const handleEditar = (id: string, nomeAtual: string) => {
    setEditandoId(id);
    setNome(nomeAtual);
  };

  const handleExcluir = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await excluirCategoriaInsumo(id);
      carregarCategorias();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Categorias de Insumos</h1>

      {erro && <p className="text-red-600 mb-4">Erro: {erro}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSalvar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editandoId ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>

      {carregando ? (
        <p className="text-gray-500">Carregando categorias...</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categorias.map((cat) => (
            <li key={cat.id} className="py-2 flex justify-between items-center">
              <span>{cat.nome}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(cat.id, cat.nome)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleExcluir(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

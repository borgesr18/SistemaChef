//src/components/configuracoes/CategoriasReceitas.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface CategoriaReceita {
  id: string;
  nome: string;
}

export default function CategoriasReceitas() {
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const res = await apiClient.get('/api/configuracoes/categorias-receitas');
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Formato inválido');
        setCategorias(json);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setErro('Erro ao carregar categorias de receitas');
      } finally {
        setCarregando(false);
      }
    }

    carregarCategorias();
  }, []);

  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) return;

    try {
      const res = await apiClient.post('/api/configuracoes/categorias-receitas', {
        nome: novaCategoria,
      });
      const nova = await res.json();
      setCategorias((prev) => [...prev, nova]);
      setNovaCategoria('');
    } catch {
      alert('Erro ao adicionar categoria de receita');
    }
  };

  const excluirCategoria = async (id: string) => {
    try {
      await apiClient.delete(`/api/configuracoes/categorias-receitas/${id}`);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Erro ao excluir categoria de receita');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Categorias de Receitas</h2>

      <div className="flex gap-4">
        <input
          type="text"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria de receita"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={adicionarCategoria}
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
          {categorias.map((cat) => (
            <li key={cat.id} className="py-2 flex justify-between items-center">
              <span>{cat.nome}</span>
              <button
                onClick={() => excluirCategoria(cat.id)}
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

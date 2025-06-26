// src/components/configuracoes/CategoriasInsumosList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

interface CategoriaInsumo {
  id: string;
  nome: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriasInsumosList() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<CategoriaInsumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await apiClient.get('/api/configuracoes/categorias-insumos');
        if (!res.ok) throw new Error('Erro ao buscar categorias');
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta categoria?')) return;

    try {
      const res = await apiClient.delete(`/api/configuracoes/categorias-insumos/${id}`);
      if (!res.ok) throw new Error('Erro ao excluir categoria');
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  if (loading) return <div className="p-4">Carregando categorias...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Categorias de Insumos</h2>
      {categorias.length === 0 ? (
        <p className="text-gray-600">Nenhuma categoria cadastrada.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categorias.map((cat) => (
            <li key={cat.id} className="py-3 flex justify-between items-center">
              <span className="text-gray-900 font-medium">{cat.nome}</span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-600 hover:underline text-sm"
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

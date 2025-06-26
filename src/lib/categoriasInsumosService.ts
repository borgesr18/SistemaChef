// src/lib/categoriasInsumosService.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from './apiClient';

export type CategoriaInsumo = {
  id: string;
  nome: string;
  created_at?: string;
};

export function useCategoriasInsumos() {
  const [categorias, setCategorias] = useState<CategoriaInsumo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/categorias-insumos');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao buscar categorias');
      setCategorias(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarCategoria = useCallback(async (nome: string) => {
    const response = await apiClient.post('/api/categorias-insumos', { nome });
    if (!response.ok) throw new Error('Erro ao adicionar categoria');
    await fetchCategorias();
  }, [fetchCategorias]);

  const atualizarCategoria = useCallback(async (id: string, nome: string) => {
    const response = await apiClient.put(`/api/categorias-insumos/${id}`, { nome });
    if (!response.ok) throw new Error('Erro ao atualizar categoria');
    await fetchCategorias();
  }, [fetchCategorias]);

  const excluirCategoria = useCallback(async (id: string) => {
    const response = await apiClient.delete(`/api/categorias-insumos/${id}`);
    if (!response.ok) throw new Error('Erro ao excluir categoria');
    await fetchCategorias();
  }, [fetchCategorias]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return {
    categorias,
    loading,
    error,
    adicionarCategoria,
    atualizarCategoria,
    excluirCategoria
  };
}

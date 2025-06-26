// src/lib/categoriasInsumosService.ts
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from './apiClient';

export type CategoriaInsumo = {
  id: string;
  nome: string;
};

export function useCategoriasInsumos() {
  const [categorias, setCategorias] = useState<CategoriaInsumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/categorias-insumos');
      if (!response.ok) throw new Error('Erro ao buscar categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarCategoria = async (nome: string) => {
    const response = await apiClient.post('/api/categorias-insumos', { nome });
    if (!response.ok) throw new Error('Erro ao criar categoria');
    const nova = await response.json();
    setCategorias([...categorias, nova]);
  };

  const editarCategoria = async (id: string, nome: string) => {
    const response = await apiClient.put(`/api/categorias-insumos/${id}`, { nome });
    if (!response.ok) throw new Error('Erro ao editar categoria');
    const atualizada = await response.json();
    setCategorias(
      categorias.map((cat) => (cat.id === id ? atualizada : cat))
    );
  };

  const deletarCategoria = async (id: string) => {
    const response = await apiClient.delete(`/api/categorias-insumos/${id}`);
    if (!response.ok) throw new Error('Erro ao excluir categoria');
    setCategorias(categorias.filter((cat) => cat.id !== id));
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    erro,
    fetchCategorias,
    criarCategoria,
    editarCategoria,
    deletarCategoria,
  };
}

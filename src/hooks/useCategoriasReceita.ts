// src/hooks/useCategoriasReceita.ts
import { useEffect, useState } from 'react';
import {
  fetchCategorias,
  adicionarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from '@/lib/categoriasReceitasService';

export function useCategoriasReceita() {
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  async function adicionar(nome: string) {
    try {
      const nova = await adicionarCategoria(nome);
      setCategorias((prev) => [...prev, nova]);
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  }

  async function atualizar(id: string, nome: string) {
    try {
      const atualizada = await atualizarCategoria(id, nome);
      setCategorias((prev) =>
        prev.map((cat) => (cat.id === id ? atualizada : cat))
      );
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  }

  async function remover(id: string) {
    try {
      await excluirCategoria(id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
    }
  }

  return { categorias, adicionar, atualizar, remover };
}

// src/lib/categoriasReceitasService.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';

export interface CategoriaReceita {
  id: string;
  nome: string;
}

/**
 * Busca todas as categorias de receitas.
 */
export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('categorias_receitas')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar categorias:', error.message);
    throw new Error('Erro ao buscar categorias');
  }

  return data;
}

/**
 * Adiciona uma nova categoria de receita.
 * @param nome Nome da nova categoria
 */
export async function adicionarCategoria(nome: string) {
  const { data, error } = await supabase
    .from('categorias_receitas')
    .insert([{ nome }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar categoria:', error.message);
    throw new Error('Erro ao adicionar categoria');
  }

  return data;
}

/**
 * Atualiza o nome de uma categoria de receita.
 * @param id ID da categoria
 * @param nome Novo nome
 */
export async function atualizarCategoria(id: string, nome: string) {
  const { data, error } = await supabase
    .from('categorias_receitas')
    .update({ nome })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar categoria:', error.message);
    throw new Error('Erro ao atualizar categoria');
  }

  return data;
}

/**
 * Exclui uma categoria de receita.
 * @param id ID da categoria
 */
export async function excluirCategoria(id: string) {
  const { error } = await supabase
    .from('categorias_receitas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir categoria:', error.message);
    throw new Error('Erro ao excluir categoria');
  }
}

export const useCategoriasReceita = () => {
  const [categorias, setCategorias] = useState<CategoriaReceita[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategorias();
        setCategorias(data || []);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategorias([]);
      } finally {
        setIsLoading(false);
      }
    };
    carregarCategorias();
  }, []);

  const adicionar = async (nome: string) => {
    try {
      const nova = await adicionarCategoria(nome);
      setCategorias(prev => [...prev, nova]);
      return nova;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      return null;
    }
  };

  const atualizar = async (id: string, nome: string) => {
    try {
      const atualizada = await atualizarCategoria(id, nome);
      setCategorias(prev => prev.map(c => c.id === id ? atualizada : c));
      return atualizada;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return null;
    }
  };

  const remover = async (id: string) => {
    try {
      await excluirCategoria(id);
      setCategorias(prev => Array.isArray(prev) ? prev.filter(c => c.id !== id) : []);
      return true;
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      return false;
    }
  };

  return {
    categorias,
    isLoading,
    adicionar,
    atualizar,
    remover
  };
};

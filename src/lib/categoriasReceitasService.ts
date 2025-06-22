'use client';

import { useState, useEffect } from 'react';

export interface CategoriaReceitaInfo {
  id: string;
  nome: string;
}

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const obter = async (): Promise<CategoriaReceitaInfo[]> => {
  try {
    const response = await fetch('/api/categorias-receitas', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar categorias de receitas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar categorias de receitas:', error);
    return [];
  }
};

const categoriasPadrao: CategoriaReceitaInfo[] = [
  { id: 'entrada', nome: 'Entrada' },
  { id: 'prato-principal', nome: 'Prato Principal' },
  { id: 'acompanhamento', nome: 'Acompanhamento' },
  { id: 'sobremesa', nome: 'Sobremesa' },
  { id: 'bebida', nome: 'Bebida' },
  { id: 'molho', nome: 'Molho/Condimento' },
  { id: 'outro', nome: 'Outro' },
];

export const useCategoriasReceita = () => {
  const [categorias, setCategorias] = useState<CategoriaReceitaInfo[]>([]);

  useEffect(() => {
    const carregarCategorias = async () => {
      const categoriasCarregadas = await obter();
      setCategorias(categoriasCarregadas);
    };
    carregarCategorias();
  }, []);

  const adicionar = async (nome: string) => {
    try {
      const response = await fetch('/api/categorias-receitas', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar categoria');
      }

      const nova = await response.json();
      setCategorias(prev => [...prev, nova]);
      return nova;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      return null;
    }
  };

  const atualizar = async (id: string, nome: string) => {
    try {
      const response = await fetch(`/api/categorias-receitas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar categoria');
      }

      const atualizada = await response.json();
      setCategorias(prev => prev.map(c => c.id === id ? atualizada : c));
      return true;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return false;
    }
  };

  const remover = async (id: string) => {
    try {
      const response = await fetch(`/api/categorias-receitas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao remover categoria');
      }

      setCategorias(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      return false;
    }
  };

  const obterPorId = (id: string) => categorias.find(c => c.id === id);

  return { categorias, adicionar, atualizar, remover, obterPorId };
};

export const obterLabelCategoriaReceita = async (id: string) => {
  if (!id) return 'Não informado';
  try {
    const categorias = await obter();
    const cat = categorias.find(c => c.id === id);
    return cat ? cat.nome : id;
  } catch {
    return id;
  }
};

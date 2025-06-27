// src/lib/categoriasInsumosService.ts
import { getAuthHeaders } from './apiClient';

export interface CategoriaInsumo {
  id: string;
  nome: string;
}

export const fetchCategorias = async (): Promise<CategoriaInsumo[]> => {
  try {
    const response = await fetch('/api/configuracoes/categorias-insumos', {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar categorias de insumos');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar categorias de insumos:', error);
    return [];
  }
};

export const adicionarCategoria = async (nome: string): Promise<CategoriaInsumo | null> => {
  try {
    const response = await fetch('/api/configuracoes/categorias-insumos', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar categoria de insumo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao adicionar categoria de insumo:', error);
    return null;
  }
};

export const atualizarCategoria = async (id: number, nome: string): Promise<CategoriaInsumo | null> => {
  try {
    const response = await fetch(`/api/configuracoes/categorias-insumos/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar categoria de insumo');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar categoria de insumo:', error);
    return null;
  }
};

export const excluirCategoria = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/configuracoes/categorias-insumos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir categoria de insumo');
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir categoria de insumo:', error);
    return false;
  }
};


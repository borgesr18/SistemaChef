'use client';

import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from './apiClient';

export interface CategoriaInfo {
  id: string;
  nome: string;
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const obterCategorias = async (): Promise<CategoriaInfo[]> => {
  try {
    console.log('🔍 Buscando categorias de produtos...');
    const response = await fetch('/api/categorias', {
      headers: getAuthHeaders()
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro na API categorias: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }
    
    const categorias = await response.json();
    console.log(`✅ Categorias carregadas: ${categorias.length}`);
    return categorias;
  } catch (err) {
    console.error('❌ Erro ao buscar categorias da API:', err);
    return [];
  }
};

const categoriasPadrao: CategoriaInfo[] = [
  { id: 'hortifruti', nome: 'Hortifruti' },
  { id: 'carnes', nome: 'Carnes' },
  { id: 'laticinios', nome: 'Laticínios' },
  { id: 'graos', nome: 'Grãos e Cereais' },
  { id: 'bebidas', nome: 'Bebidas' },
  { id: 'temperos', nome: 'Temperos' },
  { id: 'outros', nome: 'Outros' },
];

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        setIsLoading(true);
        let cats = await obterCategorias();
        
        if (cats.length === 0) {
          for (const cat of categoriasPadrao) {
            try {
              const existing = cats.find(c => c.nome === cat.nome);
              if (!existing) {
                const response = await fetch('/api/categorias', {
                  method: 'POST',
                  headers: getAuthHeaders(),
                  body: JSON.stringify({ nome: cat.nome })
                });
                if (response.ok) {
                  const newCat = await response.json();
                  cats.push(newCat);
                } else if (response.status === 409) {
                  console.log(`Categoria '${cat.nome}' já existe, pulando...`);
                }
              }
            } catch (error) {
              console.error('Erro ao criar categoria padrão:', error);
            }
          }
          cats = await obterCategorias();
        }
        console.log('Categorias loaded:', cats?.length || 0);
        setCategorias(cats);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategorias([]);
      } finally {
        setIsLoading(false);
      }
    };
    carregarCategorias();
  }, []);

  const adicionarCategoria = async (nome: string) => {
    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar categoria');
      }

      const nova = await response.json();
      const novas = [...categorias, nova];
      setCategorias(novas);
      return nova;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      return null;
    }
  };

  const atualizarCategoria = async (id: string, nome: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar categoria');
      }

      const categoriaAtualizada = await response.json();
      const atualizadas = categorias.map(c =>
        c.id === id ? categoriaAtualizada : c
      );
      setCategorias(atualizadas);
      return categoriaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return null;
    }
  };

  const removerCategoria = async (id: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar categoria');
      }

      const filtradas = categorias.filter(c => c.id !== id);
      setCategorias(filtradas);
      return true;
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      return false;
    }
  };

  const obterCategoriaPorId = (id: string) => categorias.find(c => c.id === id);

  return { categorias, isLoading, adicionarCategoria, atualizarCategoria, removerCategoria, obterCategoriaPorId };
};

export const obterLabelCategoria = async (id: string) => {
  if (!id) return 'Não informado';
  const cats = await obterCategorias();
  const cat = cats.find(c => c.id === id);
  return cat ? cat.nome : id;
};

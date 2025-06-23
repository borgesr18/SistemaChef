'use client';

import { useState, useEffect } from 'react';
import { getAuthHeaders } from './apiClient';

export interface CategoriaReceitaInfo {
  id: string;
  nome: string;
}

const obter = async (): Promise<CategoriaReceitaInfo[]> => {
  try {
    console.log('🔍 Buscando categorias de receitas...');
    const response = await fetch('/api/categorias-receitas', {
      headers: getAuthHeaders()
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro na API categorias-receitas: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao buscar categorias de receitas: ${response.status}`);
    }
    
    const categorias = await response.json();
    console.log(`✅ Categorias de receitas carregadas: ${categorias.length}`);
    return categorias;
  } catch (error) {
    console.error('❌ Erro ao buscar categorias de receitas:', error);
    return [];
  }
};

const categoriasPadrao: CategoriaReceitaInfo[] = [
  { id: '', nome: 'Entrada' },
  { id: '', nome: 'Prato Principal' },
  { id: '', nome: 'Acompanhamento' },
  { id: '', nome: 'Sobremesa' },
  { id: '', nome: 'Bebida' },
  { id: '', nome: 'Molho/Condimento' },
  { id: '', nome: 'Outro' },
];

export const useCategoriasReceita = () => {
  const [categorias, setCategorias] = useState<CategoriaReceitaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const carregarCategorias = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        
        let cats = await obter();
        
        if (!isMounted) return;
        
        if (cats.length === 0) {
          for (const cat of categoriasPadrao) {
            if (!isMounted) return;
            try {
              const response = await fetch('/api/categorias-receitas', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ nome: cat.nome })
              });
              if (response.ok) {
                const newCat = await response.json();
                cats.push(newCat);
              } else if (response.status === 409) {
                console.log(`Categoria de receita '${cat.nome}' já existe, pulando...`);
              }
            } catch (error) {
              console.error('Erro ao criar categoria de receita padrão:', error);
            }
          }
          if (isMounted) {
            cats = await obter();
          }
        }
        
        if (isMounted) {
          setCategorias(cats);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias de receitas:', error);
        if (isMounted) {
          setCategorias([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    carregarCategorias();
    
    return () => {
      isMounted = false;
    };
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

  return { categorias, isLoading, adicionar, atualizar, remover, obterPorId };
};

export const obterLabelCategoriaReceita = (id: string, categorias: CategoriaReceitaInfo[] = []) => {
  if (!id) return 'Não informado';
  const cat = categorias.find(c => c.id === id);
  return cat ? cat.nome : id;
};

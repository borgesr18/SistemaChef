// 📁 src/lib/produtosService.ts
'use client';

import { useState, useEffect } from 'react';
import { getAuthHeaders } from './apiClient';

export interface ProdutoInfo {
  id: string;
  nome: string;
  categoriaId: string;
  categoriaNome?: string;
  marca?: string;
  unidadeId: string;
  unidadeNome?: string;
  preco: number;
  precoUnitario?: number;
  fornecedor: string;
  pesoEmbalagem?: number;
  imagem?: string;
  ultimaMovimentacao?: string;
  infoNutricional?: {
    calorias: number;
    carboidratos: number;
    proteinas: number;
    gordurasTotais: number;
    gordurasSaturadas: number;
    gordurasTrans: number;
    fibras: number;
    sodio: number;
  };
}

export const obterProdutos = async (): Promise<ProdutoInfo[]> => {
  try {
    const response = await fetch('/api/produtos', {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Erro ao buscar produtos');

    const produtos = await response.json();

    return Array.isArray(produtos) ? produtos.map((p: any) => ({
      id: p.id,
      nome: p.nome,
      categoriaId: p.categoria,
      categoriaNome: p.categoriaRef?.nome,
      marca: p.marca,
      unidadeId: p.unidadeMedida,
      unidadeNome: p.unidadeRef?.nome,
      preco: Number(p.preco) || 0,
      precoUnitario: p.precoUnitario ? Number(p.precoUnitario) : undefined,
      fornecedor: p.fornecedor,
      pesoEmbalagem: p.pesoEmbalagem ? Number(p.pesoEmbalagem) : undefined,
      imagem: p.imagem,
      ultimaMovimentacao: p.ultimaMovimentacao,
      infoNutricional: p.infoNutricional ? {
        calorias: Number(p.infoNutricional.calorias),
        carboidratos: Number(p.infoNutricional.carboidratos),
        proteinas: Number(p.infoNutricional.proteinas),
        gordurasTotais: Number(p.infoNutricional.gordurasTotais),
        gordurasSaturadas: Number(p.infoNutricional.gordurasSaturadas),
        gordurasTrans: Number(p.infoNutricional.gordurasTrans),
        fibras: Number(p.infoNutricional.fibras),
        sodio: Number(p.infoNutricional.sodio),
      } : undefined,
    })) : [];
  } catch (error) {
    console.error('Erro ao buscar produtos da API:', error);
    return [];
  }
};

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setIsLoading(true);
      const lista = await obterProdutos();
      setProdutos(lista);
      setIsLoading(false);
    };
    carregar();
  }, []);

  const adicionarProduto = async (produto: Omit<ProdutoInfo, 'id'>) => {
    try {
      const payload = {
        ...produto,
        precoUnitario: produto.pesoEmbalagem ? produto.preco / produto.pesoEmbalagem : undefined,
      };

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao adicionar produto');

      const novo = await response.json();
      setProdutos(prev => [...prev, novo]);
      return novo;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return null;
    }
  };

  const atualizarProduto = async (id: string, produto: Partial<ProdutoInfo>) => {
    try {
      const payload = {
        ...produto,
        precoUnitario: produto.pesoEmbalagem ? produto.preco! / produto.pesoEmbalagem : undefined,
      };

      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao atualizar produto');

      const atualizado = await response.json();
      setProdutos(prev => prev.map(p => p.id === id ? atualizado : p));
      return atualizado;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Erro ao remover produto');

      setProdutos(prev => Array.isArray(prev) ? prev.filter(p => p.id !== id) : []);
      return true;
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      return false;
    }
  };

  const obterProdutoPorId = (id: string) => Array.isArray(produtos) ? produtos.find(p => p.id === id) : undefined;

  return {
    produtos,
    isLoading,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    obterProdutoPorId,
  };
};

export const obterLabelCategoriaFromRef = (categoriaRef: any) => {
  return categoriaRef?.nome || 'Categoria não informada';
};


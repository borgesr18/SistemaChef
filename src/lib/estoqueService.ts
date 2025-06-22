'use client';

import { useState, useEffect, useCallback } from 'react';
import { obterProdutos, ProdutoInfo } from './produtosService';
import {
  useFichasTecnicas,
  FichaTecnicaInfo,
  IngredienteFicha
} from './fichasTecnicasService';

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  preco?: number;
  fornecedor?: string;
  marca?: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

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

const obterMovimentacoes = async (): Promise<MovimentacaoEstoque[]> => {
  try {
    const response = await fetch('/api/estoque', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar movimentações');
    }
    
    return await response.json();
  } catch (err) {
    console.error('Erro ao buscar movimentações da API:', err);
    return [];
  }
};

export const useEstoque = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fichasTecnicas, atualizarFichaTecnica } = useFichasTecnicas();

  const atualizarProdutoDeEntrada = async (mov: MovimentacaoEstoque) => {
    if (!mov.preco) return;
    
    // Atualizar produto via API
    try {
      const produtos = await obterProdutos();
      const produto = produtos.find(p => p.id === mov.produtoId);
      if (produto) {
        const pesoEmb = produto.pesoEmbalagem || 1;
        const precoUnitario = pesoEmb > 0 ? (mov.preco || produto.preco) / pesoEmb : 0;
        
        const produtoAtualizado = {
          ...produto,
          preco: mov.preco || produto.preco,
          precoUnitario,
          fornecedor: mov.fornecedor || produto.fornecedor,
          marca: mov.marca || produto.marca,
        };

        await fetch(`/api/produtos/${produto.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(produtoAtualizado)
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }

    // Atualizar fichas técnicas que usam este produto
    fichasTecnicas
      .filter((f: FichaTecnicaInfo) =>
        f.ingredientes.some((i: IngredienteFicha) => i.produtoId === mov.produtoId)
      )
      .forEach((f: FichaTecnicaInfo) => {
        const dadosFicha = {
          nome: f.nome,
          descricao: f.descricao,
          categoria: f.categoria,
          ingredientes: f.ingredientes.map(
            (i: IngredienteFicha) => ({
              produtoId: i.produtoId,
              quantidade: i.quantidade,
              unidade: i.unidade,
            })
          ) as Omit<IngredienteFicha, 'custo' | 'id'>[],
          modoPreparo: f.modoPreparo,
          tempoPreparo: f.tempoPreparo,
          rendimentoTotal: f.rendimentoTotal,
          unidadeRendimento: f.unidadeRendimento,
          observacoes: f.observacoes || ''
        } as Omit<
          FichaTecnicaInfo,
          | 'id'
          | 'custoTotal'
          | 'custoPorcao'
          | 'infoNutricional'
          | 'infoNutricionalPorcao'
          | 'dataCriacao'
          | 'dataModificacao'
        >;
        atualizarFichaTecnica(f.id, dadosFicha);
      });
  };

  useEffect(() => {
    const carregarMovimentacoes = async () => {
      setIsLoading(true);
      const todas = await obterMovimentacoes();
      const filtradas = todas.filter(m => m.fornecedor !== 'Producao');
      setMovimentacoes(filtradas);
      setIsLoading(false);
    };
    carregarMovimentacoes();
  }, []);

  const registrarEntrada = async (dados: {
    produtoId: string;
    quantidade: number;
    preco: number;
    fornecedor: string;
    marca?: string;
  }) => {
    try {
      const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...dados,
          data: new Date().toISOString(),
          tipo: 'entrada'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar entrada');
      }

      const nova = await response.json();
      const novas = [...movimentacoes, nova];
      setMovimentacoes(novas);

      // Atualizar produto com novo preço/fornecedor/marca
      await atualizarProdutoDeEntrada(nova);

      return nova;
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      return null;
    }
  };

  const registrarSaida = async (dados: { produtoId: string; quantidade: number }) => {
    try {
      const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          produtoId: dados.produtoId,
          quantidade: -Math.abs(dados.quantidade),
          data: new Date().toISOString(),
          tipo: 'saida'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar saída');
      }

      const nova = await response.json();
      const novas = [...movimentacoes, nova];
      setMovimentacoes(novas);
      return nova;
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      return null;
    }
  };

  const atualizarMovimentacao = async (id: string, dados: Partial<MovimentacaoEstoque>) => {
    try {
      const response = await fetch(`/api/estoque/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar movimentação');
      }

      const atualizado = await response.json();
      const novas = movimentacoes.map(m => m.id === id ? atualizado : m);
      setMovimentacoes(novas);
      
      if (atualizado.tipo === 'entrada') {
        await atualizarProdutoDeEntrada(atualizado);
      }
      
      return atualizado;
    } catch (error) {
      console.error('Erro ao atualizar movimentação:', error);
      return null;
    }
  };

  const removerMovimentacao = async (id: string) => {
    try {
      const response = await fetch(`/api/estoque/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar movimentação');
      }

      const novas = movimentacoes.filter(m => m.id !== id);
      setMovimentacoes(novas);
      return true;
    } catch (error) {
      console.error('Erro ao remover movimentação:', error);
      return false;
    }
  };

  const obterHistoricoPorProduto = (produtoId: string) =>
    movimentacoes.filter((m: MovimentacaoEstoque) => m.produtoId === produtoId);

  const calcularEstoqueAtual = useCallback((produtoId: string) =>
    movimentacoes
      .filter((m: MovimentacaoEstoque) => m.produtoId === produtoId)
      .reduce((total: number, m: MovimentacaoEstoque) => total + m.quantidade, 0),
    [movimentacoes]
  );

  return {
    movimentacoes,
    isLoading,
    registrarEntrada,
    registrarSaida,
    atualizarMovimentacao,
    removerMovimentacao,
    obterHistoricoPorProduto,
    calcularEstoqueAtual,
  };
};

'use client';

import { useState, useEffect } from 'react';
import { getAuthHeaders } from './apiClient';

export interface MovimentacaoProducao {
  id: string;
  fichaId: string;
  quantidade: number;
  validade?: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);



const obterMovimentacoes = async (): Promise<MovimentacaoProducao[]> => {
  try {
    const response = await fetch('/api/estoque-producao', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar movimentações de produção');
    }
    
    return await response.json();
  } catch (err) {
    console.error('Erro ao buscar movimentações de produção da API:', err);
    return [];
  }
};

export const useEstoqueProducao = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoProducao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarMovimentacoes = async () => {
      setIsLoading(true);
      const dados = await obterMovimentacoes();
      setMovimentacoes(dados);
      setIsLoading(false);
    };
    carregarMovimentacoes();
  }, []);

  const registrarEntrada = async (dados: { fichaId: string; quantidade: number; validade?: string }) => {
    try {
      const response = await fetch('/api/estoque-producao', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...dados,
          data: new Date().toISOString(),
          tipo: 'entrada'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar entrada de produção');
      }

      const nova = await response.json();
      const novas = [...movimentacoes, nova];
      setMovimentacoes(novas);
      return nova;
    } catch (error) {
      console.error('Erro ao registrar entrada de produção:', error);
      return null;
    }
  };

  const registrarSaida = async (dados: { fichaId: string; quantidade: number }) => {
    try {
      const response = await fetch('/api/estoque-producao', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fichaId: dados.fichaId,
          quantidade: -Math.abs(dados.quantidade),
          data: new Date().toISOString(),
          tipo: 'saida'
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar saída de produção');
      }

      const nova = await response.json();
      const novas = [...movimentacoes, nova];
      setMovimentacoes(novas);
      return nova;
    } catch (error) {
      console.error('Erro ao registrar saída de produção:', error);
      return null;
    }
  };

  const calcularEstoqueAtual = (fichaId: string) =>
    movimentacoes
      .filter(m => m.fichaId === fichaId)
      .reduce((tot, m) => tot + m.quantidade, 0);

  const atualizarMovimentacao = async (id: string, dados: Partial<MovimentacaoProducao>) => {
    try {
      const response = await fetch(`/api/estoque-producao/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar movimentação de produção');
      }

      const atualizado = await response.json();
      const novas = movimentacoes.map(m => m.id === id ? atualizado : m);
      setMovimentacoes(novas);
      return atualizado;
    } catch (error) {
      console.error('Erro ao atualizar movimentação de produção:', error);
      return null;
    }
  };

  const removerMovimentacao = async (id: string) => {
    try {
      const response = await fetch(`/api/estoque-producao/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar movimentação de produção');
      }

      const novas = Array.isArray(movimentacoes) ? movimentacoes.filter(m => m.id !== id) : [];
      setMovimentacoes(novas);
      return true;
    } catch (error) {
      console.error('Erro ao remover movimentação de produção:', error);
      return false;
    }
  };

  return {
    movimentacoes,
    isLoading,
    registrarEntrada,
    registrarSaida,
    calcularEstoqueAtual,
    atualizarMovimentacao,
    removerMovimentacao,
  };
};

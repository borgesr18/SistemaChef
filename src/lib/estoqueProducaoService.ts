'use client';

import { useState, useEffect } from 'react';

export interface MovimentacaoProducao {
  id: string;
  fichaId: string;
  quantidade: number;
  validade?: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const salvarMovimentacoes = (movs: MovimentacaoProducao[]) => {
  localStorage.setItem('movimentacoesEstoqueProducao', JSON.stringify(movs));
};

const obterMovimentacoes = (): MovimentacaoProducao[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('movimentacoesEstoqueProducao');
    return str ? JSON.parse(str) : [];
  } catch (err) {
    console.error('Erro ao ler movimentacoes de producao', err);
    return [];
  }
};

export const useEstoqueProducao = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoProducao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMovimentacoes(obterMovimentacoes());
    setIsLoading(false);
  }, []);

  const registrarEntrada = (dados: { fichaId: string; quantidade: number; validade?: string }) => {
    const nova: MovimentacaoProducao = {
      ...dados,
      id: gerarId(),
      data: new Date().toISOString(),
      tipo: 'entrada',
      validade: dados.validade,
    };
    const novas = [...movimentacoes, nova];
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
    return nova;
  };

  const registrarSaida = (dados: { fichaId: string; quantidade: number }) => {
    const nova: MovimentacaoProducao = {
      ...dados,
      id: gerarId(),
      data: new Date().toISOString(),
      tipo: 'saida',
      quantidade: -Math.abs(dados.quantidade),
    };
    const novas = [...movimentacoes, nova];
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
    return nova;
  };

  const calcularEstoqueAtual = (fichaId: string) =>
    movimentacoes
      .filter(m => m.fichaId === fichaId)
      .reduce((tot, m) => tot + m.quantidade, 0);

  const atualizarMovimentacao = (id: string, dados: Partial<MovimentacaoProducao>) => {
    const index = movimentacoes.findIndex(m => m.id === id);
    if (index === -1) return;
    const atualizado = { ...movimentacoes[index], ...dados } as MovimentacaoProducao;
    const novas = [...movimentacoes];
    novas[index] = atualizado;
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
  };

  const removerMovimentacao = (id: string) => {
    const novas = movimentacoes.filter(m => m.id !== id);
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
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

'use client';

import { useState, useEffect } from 'react';
import {
  FichaTecnicaInfo,
  obterFichasTecnicas,
  converterUnidade,
  useFichasTecnicas,
} from './fichasTecnicasService';

export interface ProducaoInfo {
  id: string;
  fichaId: string;
  quantidadeTotal: number;
  unidadeQuantidade: string;
  pesoUnitario: number;
  unidadePeso: string;
  unidadesGeradas: number;
  /** Custo total do lote produzido */
  custoTotal: number;
  /** Custo por unidade produzida */
  custoUnitario: number;
  validade: string;
  data: string;
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

const obterProducoes = async (): Promise<ProducaoInfo[]> => {
  try {
    const response = await fetch('/api/producao', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produções');
    }
    
    const arr = await response.json();
    return arr.map((p: any) => ({
      custoTotal: 0,
      custoUnitario: 0,
      validade: '',
      ...p,
    }));
  } catch (err) {
    console.error('Erro ao buscar produções da API:', err);
    return [];
  }
};

const recalcTodas = async (
  lista: ProducaoInfo[],
  fichas: FichaTecnicaInfo[]
) => {
  return lista.map(p => calcularCustos(p, fichas));
};

const calcularCustos = (
  prod: ProducaoInfo,
  fichas: FichaTecnicaInfo[]
) => {
  const ficha = fichas.find(f => f.id === prod.fichaId);
  if (!ficha) return prod;
  const qtdTotalG = converterUnidade(
    prod.quantidadeTotal,
    prod.unidadeQuantidade,
    'g'
  );
  const fichaRendG = converterUnidade(
    ficha.rendimentoTotal,
    ficha.unidadeRendimento,
    'g'
  );
  const fator = fichaRendG ? qtdTotalG / fichaRendG : 0;
  const pesoUnitG = converterUnidade(prod.pesoUnitario, prod.unidadePeso, 'g');
  const unidades = pesoUnitG ? Math.round(qtdTotalG / pesoUnitG) : prod.unidadesGeradas;
  const custoTotal = ficha.custoTotal * fator;
  const custoUnitario = unidades ? custoTotal / unidades : 0;
  return { ...prod, unidadesGeradas: unidades, custoTotal, custoUnitario };
};

export const useProducao = () => {
  const { fichasTecnicas } = useFichasTecnicas();
  const [producoes, setProducoes] = useState<ProducaoInfo[]>([]);

  useEffect(() => {
    const carregarProducoes = async () => {
      const base = await obterProducoes();
      const fichasParaCalculo = fichasTecnicas.length ? fichasTecnicas : await obterFichasTecnicas();
      const recalc = await recalcTodas(base, fichasParaCalculo);
      setProducoes(recalc);
    };
    carregarProducoes();
  }, []);

  useEffect(() => {
    const atualizarProducoes = async () => {
      if (!producoes.length) return;
      const atualizadas = await recalcTodas(producoes, fichasTecnicas);
      setProducoes(atualizadas);
    };
    atualizarProducoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fichasTecnicas]);

  const registrarProducao = async (dados: Omit<ProducaoInfo, 'id'>) => {
    try {
      const response = await fetch('/api/producao', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar produção');
      }

      const nova = await response.json();
      const novas = [...producoes, nova];
      setProducoes(novas);
      return nova;
    } catch (error) {
      console.error('Erro ao registrar produção:', error);
      return null;
    }
  };

  const atualizarProducao = async (id: string, dados: Partial<Omit<ProducaoInfo, 'id'>>) => {
    try {
      const response = await fetch(`/api/producao/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produção');
      }

      const atualizada = await response.json();
      const novas = producoes.map(p => p.id === id ? atualizada : p);
      setProducoes(novas);
      return atualizada;
    } catch (error) {
      console.error('Erro ao atualizar produção:', error);
      return null;
    }
  };

  const removerProducao = async (id: string) => {
    try {
      const response = await fetch(`/api/producao/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar produção');
      }

      const novas = producoes.filter(p => p.id !== id);
      setProducoes(novas);
      return true;
    } catch (error) {
      console.error('Erro ao remover produção:', error);
      return false;
    }
  };

  return { producoes, registrarProducao, atualizarProducao, removerProducao };
};

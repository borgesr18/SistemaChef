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

const salvarProducoes = (prods: ProducaoInfo[]) => {
  localStorage.setItem('producoes', JSON.stringify(prods));
};

const obterProducoes = (): ProducaoInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('producoes');
    const arr = str ? JSON.parse(str) : [];
    return arr.map((p: any) => ({
      custoTotal: 0,
      custoUnitario: 0,
      validade: '',
      ...p,
    }));
  } catch (err) {
    console.error('Erro ao ler produções do localStorage', err);
    return [];
  }
};

const recalcTodas = (
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
    const base = obterProducoes();
    const recalc = recalcTodas(base, fichasTecnicas.length ? fichasTecnicas : obterFichasTecnicas());
    setProducoes(recalc);
  }, []);

  useEffect(() => {
    if (!producoes.length) return;
    const atualizadas = recalcTodas(producoes, fichasTecnicas);
    setProducoes(atualizadas);
    salvarProducoes(atualizadas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fichasTecnicas]);

  const registrarProducao = (dados: Omit<ProducaoInfo, 'id'>) => {
    const nova: ProducaoInfo = { ...dados, id: gerarId() };
    const novas = [...producoes, nova];
    setProducoes(novas);
    salvarProducoes(novas);
    return nova;
  };

  const atualizarProducao = (id: string, dados: Partial<Omit<ProducaoInfo, 'id'>>) => {
    const index = producoes.findIndex(p => p.id === id);
    if (index === -1) return;
    const atualizada = { ...producoes[index], ...dados } as ProducaoInfo;
    const novas = [...producoes];
    novas[index] = atualizada;
    setProducoes(novas);
    salvarProducoes(novas);
  };

  const removerProducao = (id: string) => {
    const novas = producoes.filter(p => p.id !== id);
    setProducoes(novas);
    salvarProducoes(novas);
  };

  return { producoes, registrarProducao, atualizarProducao, removerProducao };
};

'use client';

import { useState, useEffect } from 'react';

export interface UnidadeInfo {
  id: string; // sigla da unidade ex: kg, g
  nome: string; // nome legivel
}

const gerarId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const salvarUnidades = (dados: UnidadeInfo[]) => {
  localStorage.setItem('unidadesMedida', JSON.stringify(dados));
};

const obterUnidades = (): UnidadeInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('unidadesMedida');
    return str ? JSON.parse(str) : [];
  } catch (err) {
    console.error('Erro ao ler unidades', err);
    return [];
  }
};

const unidadesPadrao: UnidadeInfo[] = [
  { id: 'g', nome: 'Gramas (g)' },
  { id: 'kg', nome: 'Quilogramas (kg)' },
  { id: 'ml', nome: 'Mililitros (ml)' },
  { id: 'l', nome: 'Litros (l)' },
  { id: 'un', nome: 'Unidade' },
  { id: 'cx', nome: 'Caixa' },
  { id: 'pct', nome: 'Pacote' },
];

export const useUnidadesMedida = () => {
  const [unidades, setUnidades] = useState<UnidadeInfo[]>([]);

  useEffect(() => {
    let atual = obterUnidades();
    if (atual.length === 0) {
      atual = unidadesPadrao;
      salvarUnidades(atual);
    }
    setUnidades(atual);
  }, []);

  const adicionarUnidade = (id: string, nome: string) => {
    const nova = { id, nome };
    const novas = [...unidades, nova];
    setUnidades(novas);
    salvarUnidades(novas);
    return nova;
  };

  const atualizarUnidade = (id: string, nome: string) => {
    const atualizadas = unidades.map(u => (u.id === id ? { ...u, nome } : u));
    setUnidades(atualizadas);
    salvarUnidades(atualizadas);
  };

  const removerUnidade = (id: string) => {
    const filtradas = unidades.filter(u => u.id !== id);
    setUnidades(filtradas);
    salvarUnidades(filtradas);
  };

  const obterUnidadePorId = (id: string) => unidades.find(u => u.id === id);

  return {
    unidades,
    adicionarUnidade,
    atualizarUnidade,
    removerUnidade,
    obterUnidadePorId,
  };
};

export const obterLabelUnidade = (id: string) => {
  if (!id) return 'Não informado';
  const unidade = obterUnidades().find(u => u.id === id);
  return unidade ? unidade.nome : id;
};

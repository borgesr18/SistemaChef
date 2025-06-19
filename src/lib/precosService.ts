'use client';
import { useState, useEffect } from 'react';

export interface EstrategiaPreco {
  id: string;
  producaoId: string;
  fichaId: string;
  custoUnitario: number;
  lucro1: number;
  preco1: number;
  lucro2: number;
  preco2: number;
  lucro3: number;
  preco3: number;
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const salvar = (dados: EstrategiaPreco[]) => {
  localStorage.setItem('precosVenda', JSON.stringify(dados));
};

const ler = (): EstrategiaPreco[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('precosVenda');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
};

export const usePrecosVenda = () => {
  const [estrategias, setEstrategias] = useState<EstrategiaPreco[]>([]);

  useEffect(() => {
    setEstrategias(ler());
  }, []);

  const salvarEstrategia = (dados: Omit<EstrategiaPreco, 'id'>, id?: string) => {
    const existentes = [...estrategias];
    if (id) {
      const idx = existentes.findIndex(e => e.id === id);
      if (idx !== -1) {
        existentes[idx] = { ...dados, id };
        setEstrategias(existentes);
        salvar(existentes);
        return;
      }
    }
    const nova = { ...dados, id: gerarId() };
    const novas = [...estrategias, nova];
    setEstrategias(novas);
    salvar(novas);
  };

  const removerEstrategia = (id: string) => {
    const novas = estrategias.filter(e => e.id !== id);
    setEstrategias(novas);
    salvar(novas);
  };

  const obterPorProducao = (producaoId: string) =>
    estrategias.find(e => e.producaoId === producaoId);

  return { estrategias, salvarEstrategia, removerEstrategia, obterPorProducao };
};

'use client';
import { useState, useEffect } from 'react';
import { getAuthHeaders } from './apiClient';

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



const ler = async (): Promise<EstrategiaPreco[]> => {
  try {
    const response = await fetch('/api/precos', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar preços');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar preços da API:', error);
    return [];
  }
};

export const usePrecosVenda = () => {
  const [estrategias, setEstrategias] = useState<EstrategiaPreco[]>([]);

  useEffect(() => {
    const carregarEstrategias = async () => {
      const dados = await ler();
      setEstrategias(dados);
    };
    carregarEstrategias();
  }, []);

  const salvarEstrategia = async (dados: Omit<EstrategiaPreco, 'id'>, id?: string) => {
    try {
      if (id) {
        const response = await fetch(`/api/precos/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(dados)
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar estratégia');
        }

        const atualizada = await response.json();
        const existentes = estrategias.map(e => e.id === id ? atualizada : e);
        setEstrategias(existentes);
        return atualizada;
      } else {
        const response = await fetch('/api/precos', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(dados)
        });

        if (!response.ok) {
          throw new Error('Erro ao criar estratégia');
        }

        const nova = await response.json();
        const novas = [...estrategias, nova];
        setEstrategias(novas);
        return nova;
      }
    } catch (error) {
      console.error('Erro ao salvar estratégia:', error);
      return null;
    }
  };

  const removerEstrategia = async (id: string) => {
    try {
      const response = await fetch(`/api/precos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar estratégia');
      }

      const novas = estrategias.filter(e => e.id !== id);
      setEstrategias(novas);
      return true;
    } catch (error) {
      console.error('Erro ao remover estratégia:', error);
      return false;
    }
  };

  const obterPorProducao = (producaoId: string) =>
    estrategias.find(e => e.producaoId === producaoId);

  return { estrategias, salvarEstrategia, removerEstrategia, obterPorProducao };
};

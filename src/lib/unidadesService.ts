'use client';

import { useState, useEffect } from 'react';

export interface UnidadeInfo {
  id: string; // sigla da unidade ex: kg, g
  nome: string; // nome legivel
}

const gerarId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

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

const obterUnidades = async (): Promise<UnidadeInfo[]> => {
  try {
    const response = await fetch('/api/unidades', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      return unidadesPadrao;
    }
    
    const unidadesSalvas = await response.json();
    
    const todasUnidades = [...unidadesPadrao];
    unidadesSalvas.forEach((unidade: UnidadeInfo) => {
      if (!todasUnidades.find(u => u.id === unidade.id)) {
        todasUnidades.push(unidade);
      }
    });
    
    return todasUnidades;
  } catch (err) {
    console.error('Erro ao buscar unidades da API:', err);
    return unidadesPadrao;
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
    const carregarUnidades = async () => {
      const atual = await obterUnidades();
      setUnidades(atual);
    };
    carregarUnidades();
  }, []);

  const adicionarUnidade = async (id: string, nome: string) => {
    try {
      if (unidadesPadrao.find(u => u.id === id)) {
        throw new Error('Já existe uma unidade padrão com esta sigla');
      }

      const response = await fetch('/api/unidades', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id, nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar unidade');
      }

      const nova = await response.json();
      const novas = [...unidades, nova];
      setUnidades(novas);
      return nova;
    } catch (error) {
      console.error('Erro ao adicionar unidade:', error);
      return null;
    }
  };

  const atualizarUnidade = async (id: string, nome: string) => {
    try {
      if (unidadesPadrao.find(u => u.id === id)) {
        throw new Error('Não é possível editar unidades padrão do sistema');
      }

      const response = await fetch(`/api/unidades/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar unidade');
      }

      const unidadeAtualizada = await response.json();
      const atualizadas = unidades.map(u => (u.id === id ? unidadeAtualizada : u));
      setUnidades(atualizadas);
      return unidadeAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar unidade:', error);
      return null;
    }
  };

  const removerUnidade = async (id: string) => {
    try {
      if (unidadesPadrao.find(u => u.id === id)) {
        throw new Error('Não é possível deletar unidades padrão do sistema');
      }

      const response = await fetch(`/api/unidades/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar unidade');
      }

      const filtradas = unidades.filter(u => u.id !== id);
      setUnidades(filtradas);
      return true;
    } catch (error) {
      console.error('Erro ao remover unidade:', error);
      return false;
    }
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

export const obterLabelUnidade = async (id: string) => {
  if (!id) return 'Não informado';
  const unidades = await obterUnidades();
  const unidade = unidades.find(u => u.id === id);
  return unidade ? unidade.nome : id;
};

'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Unidade {
  id: string;
  nome: string;
}

export default function UnidadesMedida() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [novaUnidade, setNovaUnidade] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUnidades() {
      try {
        const res = await apiClient.get('/api/configuracoes/unidades');
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Resposta inválida');
        setUnidades(json);
      } catch (err) {
        console.error('Erro ao carregar unidades:', err);
        setErro('Erro ao carregar unidades');
      } finally {
        setCarregando(false);
      }
    }

    carregarUnidades();
  }, []);

  const adicionarUnidade = async () => {
    if (!novaUnidade.trim()) return;

    try {
      const res = await apiClient.post('/api/configuracoes/unidades', {
        nome: novaUnidade,
      });

      const nova = await res.json();
      setUnidades((antigas) => [...antigas, nova]);
      setNovaUnidade('');
    } catch (error) {
      alert('Erro ao adicionar unidade');
    }
  };

  const excluirUnidade = async (id: string) => {
    try {
      await apiClient.delete(`/api/configuracoes/unidades/${id}`);
      setUnidades((atual) => atual.filter((u) => u.id !== id));
    } catch (error) {
      alert('Erro ao excluir unidade');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Unidades de Medida</h2>

      <div className="flex gap-4">
        <input
          type="text"
          value={novaUnidade}
          onChange={(e) => setNovaUnidade(e.target.value)}
          placeholder="Nova unidade"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={adicionarUnidade}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p className="text-red-600">{erro}</p>
      ) : (
        <ul className="divide-y">
          {unidades.map((unidade) => (
            <li
              key={unidade.id}
              className="py-2 flex justify-between items-center"
            >
              <span>{unidade.nome}</span>
              <button
                onClick={() => excluirUnidade(unidade.id)}
                className="text-red-500 text-sm"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

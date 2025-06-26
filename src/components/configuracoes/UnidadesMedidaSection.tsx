//src/components/configuracoes/UnidadesMedidaSection.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Unidade {
  id: string;
  nome: string;
}

export default function UnidadesMedidaSection() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [novaUnidade, setNovaUnidade] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await apiClient.get('/api/configuracoes/unidades');
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Formato inválido');
        setUnidades(json);
      } catch (err) {
        setErro('Erro ao carregar unidades');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const adicionar = async () => {
    if (!novaUnidade.trim()) return;
    try {
      const res = await apiClient.post('/api/configuracoes/unidades', {
        nome: novaUnidade,
      });
      const nova = await res.json();
      setUnidades((prev) => [...prev, nova]);
      setNovaUnidade('');
    } catch {
      alert('Erro ao adicionar unidade');
    }
  };

  const excluir = async (id: string) => {
    try {
      await apiClient.delete(`/api/configuracoes/unidades/${id}`);
      setUnidades((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Erro ao excluir unidade');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Unidades de Medida</h2>
      <div className="flex gap-2">
        <input
          value={novaUnidade}
          onChange={(e) => setNovaUnidade(e.target.value)}
          placeholder="Nova unidade"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={adicionar}
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
          {unidades.map((u) => (
            <li key={u.id} className="flex justify-between py-2">
              <span>{u.nome}</span>
              <button
                onClick={() => excluir(u.id)}
                className="text-sm text-red-600"
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

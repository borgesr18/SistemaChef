'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface Unidade {
  id: string;
  nome: string;
  abreviacao: string;
}

export default function UnidadesDeMedida() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [nome, setNome] = useState('');
  const [abreviacao, setAbreviacao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUnidades() {
      try {
        const res = await apiClient.get('/api/configuracoes/unidades');
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error('Formato inválido');
        setUnidades(json);
      } catch (err) {
        console.error('Erro ao carregar unidades:', err);
        setErro('Erro ao carregar unidades de medida');
      } finally {
        setCarregando(false);
      }
    }

    carregarUnidades();
  }, []);

  const adicionarUnidade = async () => {
    if (!nome.trim() || !abreviacao.trim()) return;

    try {
      const res = await apiClient.post('/api/configuracoes/unidades', {
        nome,
        abreviacao,
      });
      const nova = await res.json();
      setUnidades((prev) => [...prev, nova]);
      setNome('');
      setAbreviacao('');
    } catch {
      alert('Erro ao adicionar unidade');
    }
  };

  const excluirUnidade = async (id: string) => {
    try {
      await apiClient.delete(`/api/configuracoes/unidades/${id}`);
      setUnidades((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Erro ao excluir unidade');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Unidades de Medida</h2>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo (ex: Quilograma)"
          className="border px-3 py-2 rounded w-[240px]"
        />
        <input
          type="text"
          value={abreviacao}
          onChange={(e) => setAbreviacao(e.target.value)}
          placeholder="Abreviação (ex: kg)"
          className="border px-3 py-2 rounded w-[160px]"
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
          {unidades.map((u) => (
            <li key={u.id} className="py-2 flex justify-between items-center">
              <span>{u.nome} ({u.abreviacao})</span>
              <button
                onClick={() => excluirUnidade(u.id)}
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


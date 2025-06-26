"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

interface CategoriaInsumo {
  id: string;
  nome: string;
}

export default function ConfiguracoesLayout() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<CategoriaInsumo[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const res = await apiClient.get("/api/configuracoes/categorias-insumos");
        const json = await res.json();
        setCategorias(json);
      } catch (err: any) {
        setErro("Erro ao carregar categorias");
      } finally {
        setCarregando(false);
      }
    }
    carregarCategorias();
  }, []);

  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) return;
    try {
      const res = await apiClient.post("/api/configuracoes/categorias-insumos", {
        nome: novaCategoria,
      });
      const nova = await res.json();
      setCategorias((antigas) => [...antigas, nova]);
      setNovaCategoria("");
    } catch {
      alert("Erro ao adicionar categoria");
    }
  };

  const excluirCategoria = async (id: string) => {
    try {
      await apiClient.delete(`/api/configuracoes/categorias-insumos/${id}`);
      setCategorias((atual) => atual.filter((cat) => cat.id !== id));
    } catch {
      alert("Erro ao excluir categoria");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Categorias de Insumos</h1>

      <div className="flex gap-4">
        <input
          type="text"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={adicionarCategoria}
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
          {categorias.map((cat) => (
            <li
              key={cat.id}
              className="py-2 flex justify-between items-center"
            >
              <span>{cat.nome}</span>
              <button
                onClick={() => excluirCategoria(cat.id)}
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

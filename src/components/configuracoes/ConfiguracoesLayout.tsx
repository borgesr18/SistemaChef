// ✅ src/components/configuracoes/ConfiguracoesLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

interface CategoriaInsumo {
  id: string;
  nome: string;
}

interface UnidadeMedida {
  id: string;
  nome: string;
}

interface CategoriaReceita {
  id: string;
  nome: string;
}

interface Usuario {
  id: string;
  email: string;
}

export default function ConfiguracoesLayout() {
  const { user } = useAuth();

  const [aba, setAba] = useState("insumos");

  const [categorias, setCategorias] = useState<CategoriaInsumo[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");

  const [unidades, setUnidades] = useState<UnidadeMedida[]>([]);
  const [novaUnidade, setNovaUnidade] = useState("");

  const [categoriasReceitas, setCategoriasReceitas] = useState<CategoriaReceita[]>([]);
  const [novaCategoriaReceita, setNovaCategoriaReceita] = useState("");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      const resInsumos = await apiClient.get("/api/configuracoes/categorias-insumos");
      setCategorias(await resInsumos.json());

      const resUnidades = await apiClient.get("/api/configuracoes/unidades");
      setUnidades(await resUnidades.json());

      const resReceitas = await apiClient.get("/api/configuracoes/categorias-receitas");
      setCategoriasReceitas(await resReceitas.json());

      const resUsuarios = await apiClient.get("/api/usuarios");
      setUsuarios(await resUsuarios.json());
    };
    carregarDados();
  }, []);

  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) return;
    const res = await apiClient.post("/api/configuracoes/categorias-insumos", { nome: novaCategoria });
    const nova = await res.json();
    setCategorias([...categorias, nova]);
    setNovaCategoria("");
  };

  const adicionarUnidade = async () => {
    if (!novaUnidade.trim()) return;
    const res = await apiClient.post("/api/configuracoes/unidades", { nome: novaUnidade });
    const nova = await res.json();
    setUnidades([...unidades, nova]);
    setNovaUnidade("");
  };

  const adicionarCategoriaReceita = async () => {
    if (!novaCategoriaReceita.trim()) return;
    const res = await apiClient.post("/api/configuracoes/categorias-receitas", { nome: novaCategoriaReceita });
    const nova = await res.json();
    setCategoriasReceitas([...categoriasReceitas, nova]);
    setNovaCategoriaReceita("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>

      <div className="flex gap-4">
        <button onClick={() => setAba("insumos")} className={aba === "insumos" ? "font-bold" : ""}>Categorias de Insumos</button>
        <button onClick={() => setAba("unidades")} className={aba === "unidades" ? "font-bold" : ""}>Unidades de Medida</button>
        <button onClick={() => setAba("receitas")} className={aba === "receitas" ? "font-bold" : ""}>Categorias de Receitas</button>
        <button onClick={() => setAba("usuarios")} className={aba === "usuarios" ? "font-bold" : ""}>Usuários</button>
      </div>

      {aba === "insumos" && (
        <section>
          <h2 className="text-xl font-semibold">Categorias de Insumos</h2>
          <div className="flex gap-4 mb-4">
            <input value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} className="border px-2 py-1 rounded" placeholder="Nova categoria" />
            <button onClick={adicionarCategoria} className="bg-blue-500 text-white px-4 py-1 rounded">Adicionar</button>
          </div>
          <ul>
            {categorias.map(cat => <li key={cat.id}>{cat.nome}</li>)}
          </ul>
        </section>
      )}

      {aba === "unidades" && (
        <section>
          <h2 className="text-xl font-semibold">Unidades de Medida</h2>
          <div className="flex gap-4 mb-4">
            <input value={novaUnidade} onChange={e => setNovaUnidade(e.target.value)} className="border px-2 py-1 rounded" placeholder="Nova unidade" />
            <button onClick={adicionarUnidade} className="bg-blue-500 text-white px-4 py-1 rounded">Adicionar</button>
          </div>
          <ul>
            {unidades.map(uni => <li key={uni.id}>{uni.nome}</li>)}
          </ul>
        </section>
      )}

      {aba === "receitas" && (
        <section>
          <h2 className="text-xl font-semibold">Categorias de Receitas</h2>
          <div className="flex gap-4 mb-4">
            <input value={novaCategoriaReceita} onChange={e => setNovaCategoriaReceita(e.target.value)} className="border px-2 py-1 rounded" placeholder="Nova categoria de receita" />
            <button onClick={adicionarCategoriaReceita} className="bg-blue-500 text-white px-4 py-1 rounded">Adicionar</button>
          </div>
          <ul>
            {categoriasReceitas.map(cat => <li key={cat.id}>{cat.nome}</li>)}
          </ul>
        </section>
      )}

      {aba === "usuarios" && (
        <section>
          <h2 className="text-xl font-semibold">Usuários Cadastrados</h2>
          <ul>
            {usuarios.map(u => <li key={u.id}>{u.email}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}

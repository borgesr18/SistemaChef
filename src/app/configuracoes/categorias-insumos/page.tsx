// src/app/configuracoes/categorias-insumos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  listarCategoriasInsumos,
  adicionarCategoria,
  atualizarCategoria,
  excluirCategoria
} from '@/lib/categoriasInsumosService';

export default function CategoriasInsumosPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    try {
      const dados = await listarCategoriasInsumos();
      setCategorias(dados);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar() {
    try {
      if (editandoId) {
        await atualizarCategoria(editandoId, nome);
      } else {
        await adicionarCategoria(nome);
      }
      setNome('');
      setEditandoId(null);
      await carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  async function remover(id: string) {
    try {
      await excluirCategoria(id);
      await carregar();
    } catch (e: any) {
      setErro(e.message);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Categorias de Insumos</h1>

      {erro && <p className="text-red-600">Erro: {erro}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={salvar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editandoId ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>

      <ul className="space-y-2">
        {categorias.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center bg-white shadow p-3 rounded">
            <span>{cat.nome}</span>
            <div>
              <button
                onClick={() => {
                  setNome(cat.nome);
                  setEditandoId(cat.id);
                }}
                className="text-sm text-blue-600 mr-3"
              >
                Editar
              </button>
              <button
                onClick={() => remover(cat.id)}
                className="text-sm text-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

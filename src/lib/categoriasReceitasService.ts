'use client';

import { useState, useEffect } from 'react';

export interface CategoriaReceitaInfo {
  id: string;
  nome: string;
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const salvar = (cats: CategoriaReceitaInfo[]) => {
  localStorage.setItem('categoriasReceitas', JSON.stringify(cats));
};

const obter = (): CategoriaReceitaInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('categoriasReceitas');
    return str ? JSON.parse(str) : [];
  } catch {
    return [];
  }
};

const categoriasPadrao: CategoriaReceitaInfo[] = [
  { id: 'entrada', nome: 'Entrada' },
  { id: 'prato-principal', nome: 'Prato Principal' },
  { id: 'acompanhamento', nome: 'Acompanhamento' },
  { id: 'sobremesa', nome: 'Sobremesa' },
  { id: 'bebida', nome: 'Bebida' },
  { id: 'molho', nome: 'Molho/Condimento' },
  { id: 'outro', nome: 'Outro' },
];

export const useCategoriasReceita = () => {
  const [categorias, setCategorias] = useState<CategoriaReceitaInfo[]>([]);

  useEffect(() => {
    let iniciais = obter();
    if (iniciais.length === 0) {
      iniciais = categoriasPadrao;
      salvar(iniciais);
    }
    setCategorias(iniciais);
  }, []);

  const adicionar = (nome: string) => {
    const nova = { id: gerarId(), nome };
    const novas = [...categorias, nova];
    setCategorias(novas);
    salvar(novas);
    return nova;
  };

  const atualizar = (id: string, nome: string) => {
    const atualizadas = categorias.map(c => (c.id === id ? { ...c, nome } : c));
    setCategorias(atualizadas);
    salvar(atualizadas);
  };

  const remover = (id: string) => {
    const filtradas = categorias.filter(c => c.id !== id);
    setCategorias(filtradas);
    salvar(filtradas);
  };

  const obterPorId = (id: string) => categorias.find(c => c.id === id);

  return { categorias, adicionar, atualizar, remover, obterPorId };
};

export const obterLabelCategoriaReceita = (id: string) => {
  if (!id) return 'Não informado';
  const cat = obter().find(c => c.id === id);
  return cat ? cat.nome : id;
};

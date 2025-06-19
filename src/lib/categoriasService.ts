'use client';

import { useState, useEffect } from 'react';

export interface CategoriaInfo {
  id: string;
  nome: string;
}

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const salvarCategorias = (cats: CategoriaInfo[]) => {
  localStorage.setItem('categoriasProdutos', JSON.stringify(cats));
};

const obterCategorias = (): CategoriaInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('categoriasProdutos');
    return str ? JSON.parse(str) : [];
  } catch (err) {
    console.error('Erro ao ler categorias', err);
    return [];
  }
};

const categoriasPadrao: CategoriaInfo[] = [
  { id: 'hortifruti', nome: 'Hortifruti' },
  { id: 'carnes', nome: 'Carnes' },
  { id: 'laticinios', nome: 'Laticínios' },
  { id: 'graos', nome: 'Grãos e Cereais' },
  { id: 'bebidas', nome: 'Bebidas' },
  { id: 'temperos', nome: 'Temperos' },
  { id: 'outros', nome: 'Outros' },
];

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<CategoriaInfo[]>([]);

  useEffect(() => {
    let cats = obterCategorias();
    if (cats.length === 0) {
      cats = categoriasPadrao;
      salvarCategorias(cats);
    }
    setCategorias(cats);
  }, []);

  const adicionarCategoria = (nome: string) => {
    const nova = { id: gerarId(), nome };
    const novas = [...categorias, nova];
    setCategorias(novas);
    salvarCategorias(novas);
    return nova;
  };

  const atualizarCategoria = (id: string, nome: string) => {
    const atualizadas = categorias.map(c =>
      c.id === id ? { ...c, nome } : c
    );
    setCategorias(atualizadas);
    salvarCategorias(atualizadas);
  };

  const removerCategoria = (id: string) => {
    const filtradas = categorias.filter(c => c.id !== id);
    setCategorias(filtradas);
    salvarCategorias(filtradas);
  };

  const obterCategoriaPorId = (id: string) => categorias.find(c => c.id === id);

  return { categorias, adicionarCategoria, atualizarCategoria, removerCategoria, obterCategoriaPorId };
};

export const obterLabelCategoria = (id: string) => {
  if (!id) return 'Não informado';
  const cat = obterCategorias().find(c => c.id === id);
  return cat ? cat.nome : id;
};

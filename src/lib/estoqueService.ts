'use client';

import { useState, useEffect } from 'react';
import { obterProdutos, salvarProdutos, ProdutoInfo } from './produtosService';
import {
  useFichasTecnicas,
  FichaTecnicaInfo,
  IngredienteFicha
} from './fichasTecnicasService';

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  preco?: number;
  fornecedor?: string;
  marca?: string;
  data: string;
  tipo: 'entrada' | 'saida';
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const salvarMovimentacoes = (movs: MovimentacaoEstoque[]) => {
  localStorage.setItem('movimentacoesEstoque', JSON.stringify(movs));
};

const obterMovimentacoes = (): MovimentacaoEstoque[] => {
  if (typeof window === 'undefined') return [];
  try {
    const str = localStorage.getItem('movimentacoesEstoque');
    return str ? JSON.parse(str) : [];
  } catch (err) {
    console.error('Erro ao ler movimentacoes do localStorage', err);
    return [];
  }
};

export const useEstoque = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fichasTecnicas, atualizarFichaTecnica } = useFichasTecnicas();

  const atualizarProdutoDeEntrada = (mov: MovimentacaoEstoque) => {
    if (!mov.preco) return;
    const produtos = obterProdutos();
    const atualizados = produtos.map((p: ProdutoInfo) => {
      if (p.id !== mov.produtoId) return p;
      const pesoEmb = p.pesoEmbalagem || 1;
      const precoUnitario = pesoEmb > 0 ? (mov.preco || p.preco) / pesoEmb : 0;
      return {
        ...p,
        preco: mov.preco || p.preco,
        precoUnitario,
        fornecedor: mov.fornecedor || p.fornecedor,
        marca: mov.marca || p.marca,
      };
    });
    salvarProdutos(atualizados);

    fichasTecnicas
      .filter((f: FichaTecnicaInfo) =>
        f.ingredientes.some((i: IngredienteFicha) => i.produtoId === mov.produtoId)
      )
      .forEach((f: FichaTecnicaInfo) => {
        const dadosFicha = {
          nome: f.nome,
          descricao: f.descricao,
          categoria: f.categoria,
          ingredientes: f.ingredientes.map(
            (i: IngredienteFicha) => ({
              produtoId: i.produtoId,
              quantidade: i.quantidade,
              unidade: i.unidade,
            })
          ) as Omit<IngredienteFicha, 'custo' | 'id'>[],
          modoPreparo: f.modoPreparo,
          tempoPreparo: f.tempoPreparo,
          rendimentoTotal: f.rendimentoTotal,
          unidadeRendimento: f.unidadeRendimento,
          observacoes: f.observacoes || ''
        } as Omit<
          FichaTecnicaInfo,
          | 'id'
          | 'custoTotal'
          | 'custoPorcao'
          | 'infoNutricional'
          | 'infoNutricionalPorcao'
          | 'dataCriacao'
          | 'dataModificacao'
        >;
        atualizarFichaTecnica(f.id, dadosFicha);
      });
  };

  useEffect(() => {
    const todas = obterMovimentacoes();
    const filtradas = todas.filter(m => m.fornecedor !== 'Producao');
    if (filtradas.length !== todas.length) salvarMovimentacoes(filtradas);
    setMovimentacoes(filtradas);
    setIsLoading(false);
  }, []);

  const registrarEntrada = (dados: {
    produtoId: string;
    quantidade: number;
    preco: number;
    fornecedor: string;
    marca?: string;
  }) => {
    const nova: MovimentacaoEstoque = { ...dados, id: gerarId(), data: new Date().toISOString(), tipo: 'entrada' };
    const novas = [...movimentacoes, nova];
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);

    // Atualizar produto com novo preco/fornecedor/marca
    const produtos = obterProdutos();
    const atualizados = produtos.map((p: ProdutoInfo) => {
      if (p.id !== nova.produtoId) return p;
      const pesoEmb = p.pesoEmbalagem || 1;
      const precoUnitario = pesoEmb > 0 ? dados.preco / pesoEmb : 0;
      return {
        ...p,
        preco: dados.preco,
        precoUnitario,
        fornecedor: nova.fornecedor as string,
        marca: nova.marca || p.marca,
      };
    });
    salvarProdutos(atualizados);

    // Atualizar fichas tecnicas que utilizam este produto
    fichasTecnicas
      .filter((f: FichaTecnicaInfo) =>
        f.ingredientes.some((i: IngredienteFicha) => i.produtoId === nova.produtoId)
      )
      .forEach((f: FichaTecnicaInfo) => {
        const dadosFicha = {
          nome: f.nome,
          descricao: f.descricao,
          categoria: f.categoria,
          ingredientes: f.ingredientes.map(
            (i: IngredienteFicha) => ({
              produtoId: i.produtoId,
              quantidade: i.quantidade,
              unidade: i.unidade,
            })
          ) as Omit<IngredienteFicha, 'custo' | 'id'>[],
          modoPreparo: f.modoPreparo,
          tempoPreparo: f.tempoPreparo,
          rendimentoTotal: f.rendimentoTotal,
          unidadeRendimento: f.unidadeRendimento,
          observacoes: f.observacoes || ''
        } as Omit<
          FichaTecnicaInfo,
          'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'
        >;
        atualizarFichaTecnica(f.id, dadosFicha);
      });

    return nova;
  };

  const registrarSaida = (dados: { produtoId: string; quantidade: number }) => {
    const nova: MovimentacaoEstoque = {
      id: gerarId(),
      data: new Date().toISOString(),
      tipo: 'saida',
      produtoId: dados.produtoId,
      quantidade: -Math.abs(dados.quantidade)
    };
    const novas = [...movimentacoes, nova];
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
    return nova;
  };

  const atualizarMovimentacao = (id: string, dados: Partial<MovimentacaoEstoque>) => {
    const index = movimentacoes.findIndex(m => m.id === id);
    if (index === -1) return;
    const atualizado = { ...movimentacoes[index], ...dados } as MovimentacaoEstoque;
    const novas = [...movimentacoes];
    novas[index] = atualizado;
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
    if (atualizado.tipo === 'entrada') {
      atualizarProdutoDeEntrada(atualizado);
    }
  };

  const removerMovimentacao = (id: string) => {
    const novas = movimentacoes.filter(m => m.id !== id);
    setMovimentacoes(novas);
    salvarMovimentacoes(novas);
  };

  const obterHistoricoPorProduto = (produtoId: string) =>
    movimentacoes.filter((m: MovimentacaoEstoque) => m.produtoId === produtoId);

  const calcularEstoqueAtual = (produtoId: string) =>
    movimentacoes
      .filter((m: MovimentacaoEstoque) => m.produtoId === produtoId)
      .reduce((total: number, m: MovimentacaoEstoque) => total + m.quantidade, 0);

  return {
    movimentacoes,
    isLoading,
    registrarEntrada,
    registrarSaida,
    atualizarMovimentacao,
    removerMovimentacao,
    obterHistoricoPorProduto,
    calcularEstoqueAtual,
  };
};

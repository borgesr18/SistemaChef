'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProdutoInfo, obterProdutos } from './produtosService';

// Tipos para fichas técnicas
export interface IngredienteFicha {
  id: string;
  produtoId: string;
  quantidade: number;
  unidade: string;
  custo: number;
}

type TipoUnidade = 'peso' | 'volume' | 'unidade';

export const infoUnidades: Record<string, { tipo: TipoUnidade; fator: number }> = {
  g: { tipo: 'peso', fator: 1 },
  kg: { tipo: 'peso', fator: 1000 },
  ml: { tipo: 'volume', fator: 1 },
  l: { tipo: 'volume', fator: 1000 },
  un: { tipo: 'unidade', fator: 1 },
  cx: { tipo: 'unidade', fator: 1 },
  pct: { tipo: 'unidade', fator: 1 },
};

export const converterUnidade = (valor: number, de: string, para: string) => {
  const uDe = infoUnidades[de];
  const uPara = infoUnidades[para];
  if (!uDe || !uPara || uDe.tipo !== uPara.tipo) return valor;
  return (valor * uDe.fator) / uPara.fator;
};

export interface InfoNutricionalFicha {
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gordurasTotais: number;
  gordurasSaturadas: number;
  gordurasTrans: number;
  fibras: number;
  sodio: number;
}

export interface FichaTecnicaInfo {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  ingredientes: IngredienteFicha[];
  modoPreparo: string;
  tempoPreparo: number; // em minutos
  rendimentoTotal: number;
  unidadeRendimento: string;
  custoTotal: number;
  custoPorcao: number;
  custoPorKg: number;
  infoNutricional?: InfoNutricionalFicha;
  infoNutricionalPorcao?: InfoNutricionalFicha;
  observacoes?: string;
  dataCriacao: string;
  dataModificacao: string;
}

// Função para gerar ID único
const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Função para obter token de autenticação
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

// Função para obter fichas técnicas da API
export const obterFichasTecnicas = async (): Promise<FichaTecnicaInfo[]> => {
  try {
    const response = await fetch('/api/fichas-tecnicas', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar fichas técnicas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar fichas técnicas da API:', error);
    return [];
  }
};

// Calcular peso total dos ingredientes em gramas
const calcularPesoIngredientes = (
  ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[],
  todosProdutos: ProdutoInfo[]
) => {
  return ingredientes.reduce((total, ingrediente) => {
    const produto = todosProdutos.find((p: ProdutoInfo) => p.id === ingrediente.produtoId);
    if (!produto) return total;

    const unidadeIng: string = (ingrediente as any).unidade || produto.unidadeMedida;
    const tipoIng = infoUnidades[unidadeIng]?.tipo;

    if (tipoIng === 'peso') {
      return total + converterUnidade(ingrediente.quantidade, unidadeIng, 'g');
    } else if (tipoIng === 'volume') {
      return total + converterUnidade(ingrediente.quantidade, unidadeIng, 'ml');
    } else {
      const pesoEmbalagem = produto.pesoEmbalagem || infoUnidades[produto.unidadeMedida]?.fator || 1;
      const qtdUn = converterUnidade(ingrediente.quantidade, unidadeIng, produto.unidadeMedida);
      return total + (qtdUn * pesoEmbalagem);
    }
  }, 0);
};

export const calcularRendimentoTotal = (
  ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[],
  unidade: string,
  todosProdutos: ProdutoInfo[]
) => {
  const tipoRend = infoUnidades[unidade]?.tipo;
  if (tipoRend === 'peso' || tipoRend === 'volume') {
    const totalG = calcularPesoIngredientes(ingredientes, todosProdutos);
    const base = tipoRend === 'peso' ? 'g' : 'ml';
    return converterUnidade(totalG, base, unidade);
  }
  return ingredientes.reduce((tot, ing) => {
    const prod = todosProdutos.find((p: ProdutoInfo) => p.id === ing.produtoId);
    const unidadeIng: string = (ing as any).unidade || prod?.unidadeMedida || 'un';
    const qtd = converterUnidade(ing.quantidade, unidadeIng, unidade);
    return tot + qtd;
  }, 0);
};

// Hook para gerenciar fichas técnicas
export const useFichasTecnicas = () => {
  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  // Carregar fichas técnicas da API ao inicializar
  useEffect(() => {
    const carregarFichas = async () => {
      setIsLoading(true);
      const armazenadas = await obterFichasTecnicas();
      setFichasTecnicas(armazenadas);
      setIsLoading(false);
    };
    carregarFichas();
  }, []);

  // Adicionar nova ficha técnica
  const adicionarFichaTecnicaHook = async (ficha: Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'>) => {
    try {
      const response = await fetch('/api/fichas-tecnicas', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(ficha)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta da API:', response.status, errorData);
        throw new Error(`Erro ao criar ficha técnica: ${response.status}`);
      }

      const novaFicha = await response.json();
      console.log('Ficha técnica criada com sucesso:', novaFicha);
      const novasFichas = [...fichasTecnicas, novaFicha];
      setFichasTecnicas(novasFichas);
      return novaFicha;
    } catch (error) {
      console.error('Erro ao adicionar ficha técnica:', error);
      return null;
    }
  };

  // Atualizar ficha técnica existente
  const atualizarFichaTecnica = async (id: string, ficha: Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'>) => {
    try {
      const response = await fetch(`/api/fichas-tecnicas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(ficha)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar ficha técnica');
      }

      const fichaAtualizada = await response.json();
      const novasFichas = fichasTecnicas.map((f: FichaTecnicaInfo) =>
        f.id === id ? fichaAtualizada : f
      );
      
      setFichasTecnicas(novasFichas);
      return fichaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar ficha técnica:', error);
      return null;
    }
  };

  // Remover ficha técnica
  const removerFichaTecnica = async (id: string) => {
    try {
      const response = await fetch(`/api/fichas-tecnicas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar ficha técnica');
      }

      const novasFichas = fichasTecnicas.filter((f: FichaTecnicaInfo) => f.id !== id);
      setFichasTecnicas(novasFichas);
      return true;
    } catch (error) {
      console.error('Erro ao remover ficha técnica:', error);
      return false;
    }
  };

  // Obter ficha técnica por ID
  const obterFichaTecnicaPorId = (id: string) => {
    return fichasTecnicas.find((f: FichaTecnicaInfo) => f.id === id);
  };

  const memoizedFichasTecnicas = useMemo(() => fichasTecnicas, [fichasTecnicas]);

  return {
    fichasTecnicas: memoizedFichasTecnicas,
    isLoading,
    adicionarFichaTecnica: adicionarFichaTecnicaHook,
    atualizarFichaTecnica,
    removerFichaTecnica,
    obterFichaTecnicaPorId,
    calcularRendimentoTotal,
  };
};

// Dados iniciais para categorias de receitas
// Categorias de receitas são gerenciadas em categoriasReceitasService
export { obterLabelCategoriaReceita } from './categoriasReceitasService';

// Dados iniciais para unidades de rendimento
export const unidadesRendimento = [
  { value: 'porcoes', label: 'Porções' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'kg', label: 'Quilogramas (kg)' },
  { value: 'g', label: 'Gramas (g)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'ml', label: 'Mililitros (ml)' },
];

export const obterLabelUnidadeRendimento = (valor: string) => {
  const unidade = unidadesRendimento.find((u) => u.value === valor);
  return unidade ? unidade.label : valor;
};

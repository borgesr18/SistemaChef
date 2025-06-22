'use client';

import { useState, useEffect } from 'react';
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
export const calcularPesoIngredientes = async (
  ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[]
) => {
  const todosProdutos = await obterProdutos();
  return ingredientes.reduce((total, ingrediente) => {
    const produto = todosProdutos.find((p: ProdutoInfo) => p.id === ingrediente.produtoId);
    if (!produto) return total;

    const unidadeIng: string = (ingrediente as any).unidade || produto.unidadeMedida;
    const tipoUso = infoUnidades[unidadeIng]?.tipo;

    if (tipoUso === 'peso') {
      const qtdG = converterUnidade(ingrediente.quantidade, unidadeIng, 'g');
      return total + qtdG;
    }

    if (tipoUso === 'volume') {
      const qtdMl = converterUnidade(ingrediente.quantidade, unidadeIng, 'ml');
      return total + qtdMl; // aproximar 1ml = 1g
    }

    const qtdUn = converterUnidade(ingrediente.quantidade, unidadeIng, produto.unidadeMedida);
    const pesoEmb = produto.pesoEmbalagem || infoUnidades[produto.unidadeMedida]?.fator || 1;
    return total + qtdUn * pesoEmb;
  }, 0);
};

export const calcularRendimentoTotal = async (
  ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[],
  unidade: string
) => {
  const tipoRend = infoUnidades[unidade]?.tipo;
  if (tipoRend === 'peso' || tipoRend === 'volume') {
    const totalG = await calcularPesoIngredientes(ingredientes);
    const base = tipoRend === 'peso' ? 'g' : 'ml';
    return converterUnidade(totalG, base, unidade);
  }
  const todosProdutos = await obterProdutos();
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

  // Calcular custo dos ingredientes
  async function calcularCustoIngredientes(
    ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[]
  ) {
    const todosProdutos = await obterProdutos();
    return ingredientes.map((ingrediente: Omit<IngredienteFicha, 'custo' | 'id'>) => {
      const produto = todosProdutos.find((p: ProdutoInfo) => p.id === ingrediente.produtoId);
      if (!produto) {
        return {
          ...ingrediente,
          id: gerarId(),
          custo: 0
        };
      }

      const unidadeIng: string = (ingrediente as any).unidade || produto.unidadeMedida;
      const tipoUso = infoUnidades[unidadeIng]?.tipo;
      let custo = 0;

      if (tipoUso === 'peso' || tipoUso === 'volume') {
        const base = tipoUso === 'peso' ? 'g' : 'ml';
        const qtdBase = converterUnidade(ingrediente.quantidade, unidadeIng, base);
        const pesoEmbalagem = produto.pesoEmbalagem || infoUnidades[produto.unidadeMedida]?.fator || 1;
        const custoUnitario =
          produto.precoUnitario !== undefined
            ? produto.precoUnitario
            : produto.preco / pesoEmbalagem;
        custo = qtdBase * custoUnitario;
      } else {
        const quantidadeConvertida = converterUnidade(
          ingrediente.quantidade,
          unidadeIng,
          produto.unidadeMedida
        );
        custo = quantidadeConvertida * produto.preco;
      }
      
      return {
        ...ingrediente,
        id: gerarId(),
        custo
      };
    });
  }


  // Calcular informações nutricionais
  async function calcularInfoNutricional(
    ingredientes: IngredienteFicha[],
    rendimentoTotal: number
  ) {
    // Inicializar com zeros
    const infoTotal: InfoNutricionalFicha = {
      calorias: 0,
      carboidratos: 0,
      proteinas: 0,
      gordurasTotais: 0,
      gordurasSaturadas: 0,
      gordurasTrans: 0,
      fibras: 0,
      sodio: 0
    };

    // Somar valores nutricionais de cada ingrediente
    const todosProdutos = await obterProdutos();
    ingredientes.forEach((ingrediente: IngredienteFicha) => {
      const produto = todosProdutos.find((p: ProdutoInfo) => p.id === ingrediente.produtoId);
      if (produto?.infoNutricional) {
        const unidadeIng: string = (ingrediente as any).unidade || produto.unidadeMedida;
        const tipoIng = infoUnidades[unidadeIng]?.tipo;
        let qtdBase = ingrediente.quantidade;
        let base: string = 'un';

        if (tipoIng === 'peso' || tipoIng === 'volume') {
          base = tipoIng === 'peso' ? 'g' : 'ml';
          qtdBase = converterUnidade(ingrediente.quantidade, unidadeIng, base);
        } else {
          // unidade para peso/volume usando pesoEmbalagem
          const pesoEmb = produto.pesoEmbalagem || infoUnidades[produto.unidadeMedida]?.fator || 1;
          const qtdUn = converterUnidade(ingrediente.quantidade, unidadeIng, produto.unidadeMedida);
          base = infoUnidades[produto.unidadeMedida]?.tipo === 'volume' ? 'ml' : 'g';
          qtdBase = qtdUn * pesoEmb;
        }

        const proporcao = qtdBase / 100;
        
        infoTotal.calorias += produto.infoNutricional.calorias * proporcao;
        infoTotal.carboidratos += produto.infoNutricional.carboidratos * proporcao;
        infoTotal.proteinas += produto.infoNutricional.proteinas * proporcao;
        infoTotal.gordurasTotais += produto.infoNutricional.gordurasTotais * proporcao;
        infoTotal.gordurasSaturadas += produto.infoNutricional.gordurasSaturadas * proporcao;
        infoTotal.gordurasTrans += produto.infoNutricional.gordurasTrans * proporcao;
        infoTotal.fibras += produto.infoNutricional.fibras * proporcao;
        infoTotal.sodio += produto.infoNutricional.sodio * proporcao;
      }
    });

    // Calcular valores por porção
    const divisor = rendimentoTotal > 0 ? rendimentoTotal : 1;

    const infoPorcao: InfoNutricionalFicha = {
      calorias: infoTotal.calorias / divisor,
      carboidratos: infoTotal.carboidratos / divisor,
      proteinas: infoTotal.proteinas / divisor,
      gordurasTotais: infoTotal.gordurasTotais / divisor,
      gordurasSaturadas: infoTotal.gordurasSaturadas / divisor,
      gordurasTrans: infoTotal.gordurasTrans / divisor,
      fibras: infoTotal.fibras / divisor,
      sodio: infoTotal.sodio / divisor
    };

    return { infoTotal, infoPorcao };
  }

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

  return {
    fichasTecnicas,
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

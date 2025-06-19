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

// Função para salvar fichas técnicas no localStorage
export const salvarFichasTecnicas = (fichas: FichaTecnicaInfo[]) => {
  localStorage.setItem('fichasTecnicas', JSON.stringify(fichas));
};

// Função para obter fichas técnicas do localStorage com fallback
export const obterFichasTecnicas = (): FichaTecnicaInfo[] => {
  if (typeof window === 'undefined') return [];

  try {
    const fichasString = localStorage.getItem('fichasTecnicas');
    const armazenadas = fichasString ? JSON.parse(fichasString) : [];
    return Array.isArray(armazenadas) ? armazenadas : [];
  } catch (error) {
    console.error('Erro ao ler fichas técnicas do localStorage', error);
    return [];
  }
};

// Calcular peso total dos ingredientes em gramas
export const calcularPesoIngredientes = (
  ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[]
) => {
  const todosProdutos = obterProdutos();
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

export const calcularRendimentoTotal = (
  ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[],
  unidade: string
) => {
  const tipoRend = infoUnidades[unidade]?.tipo;
  if (tipoRend === 'peso' || tipoRend === 'volume') {
    const totalG = calcularPesoIngredientes(ingredientes);
    const base = tipoRend === 'peso' ? 'g' : 'ml';
    return converterUnidade(totalG, base, unidade);
  }
  const todosProdutos = obterProdutos();
  return ingredientes.reduce((tot, ing) => {
    const prod = todosProdutos.find(p => p.id === ing.produtoId);
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
  function calcularCustoIngredientes(
    ingredientes: Omit<IngredienteFicha, 'custo' | 'id'>[]
  ) {
    const todosProdutos = obterProdutos();
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
  function calcularInfoNutricional(
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
    const todosProdutos = obterProdutos();
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

  // Carregar fichas técnicas do localStorage ao inicializar e atualizar custos
  useEffect(() => {
    const armazenadas = obterFichasTecnicas();
    const atualizadas = armazenadas.map((f: any) => {
        const baseIngredientes = f.ingredientes.map((i: any) => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          unidade: (i as any).unidade || '',
        })) as Omit<IngredienteFicha, 'custo' | 'id'>[];

      const ingredientesComCusto = calcularCustoIngredientes(baseIngredientes);
      const pesoTotal = calcularPesoIngredientes(baseIngredientes);
      const rendimentoTotal = calcularRendimentoTotal(
        baseIngredientes,
        f.unidadeRendimento
      );
      const custoTotal = ingredientesComCusto.reduce(
        (total: number, ing: IngredienteFicha) => total + ing.custo,
        0
      );
      const custoPorcao = rendimentoTotal > 0 ? custoTotal / rendimentoTotal : 0;
      const custoPorKg = pesoTotal > 0 ? custoTotal / (pesoTotal / 1000) : 0;

      const { infoTotal, infoPorcao } = calcularInfoNutricional(
        ingredientesComCusto,
        rendimentoTotal
      );

      return {
        ...f,
        ingredientes: ingredientesComCusto,
        rendimentoTotal,
        custoTotal,
        custoPorcao,
        custoPorKg,
        infoNutricional: infoTotal,
        infoNutricionalPorcao: infoPorcao,
        dataModificacao: f.dataModificacao || f.ultimaAtualizacao || f.dataCriacao,
      } as FichaTecnicaInfo;
    });
    setFichasTecnicas(atualizadas);
    salvarFichasTecnicas(atualizadas);
    setIsLoading(false);
  }, []);

  // Adicionar nova ficha técnica
  const adicionarFichaTecnica = (ficha: Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'>) => {
    // Calcular custo dos ingredientes
    const ingredientesComCusto = calcularCustoIngredientes(ficha.ingredientes);
    const pesoTotal = calcularPesoIngredientes(ficha.ingredientes);
    const rendimentoTotal = calcularRendimentoTotal(
      ficha.ingredientes,
      ficha.unidadeRendimento
    );
    
    // Calcular custo total
    const custoTotal = ingredientesComCusto.reduce(
      (total: number, ingrediente: IngredienteFicha) => total + ingrediente.custo,
      0
    );
    
    // Calcular custo por porção
    const custoPorcao = rendimentoTotal > 0
      ? custoTotal / rendimentoTotal
      : 0;
    const custoPorKg = pesoTotal > 0 ? custoTotal / (pesoTotal / 1000) : 0;
    
    // Calcular informações nutricionais
    const { infoTotal, infoPorcao } = calcularInfoNutricional(
      ingredientesComCusto,
      rendimentoTotal
    );
    
    const dataAtual = new Date().toISOString();
    
    const novaFicha: FichaTecnicaInfo = {
      ...ficha,
      id: gerarId(),
      ingredientes: ingredientesComCusto,
      rendimentoTotal,
      custoTotal,
      custoPorcao,
      custoPorKg,
      infoNutricional: infoTotal,
      infoNutricionalPorcao: infoPorcao,
      dataCriacao: dataAtual,
      dataModificacao: dataAtual
    };
    
    const novasFichas = [...fichasTecnicas, novaFicha];
    setFichasTecnicas(novasFichas);
    salvarFichasTecnicas(novasFichas);
    return novaFicha;
  };

  // Atualizar ficha técnica existente
  const atualizarFichaTecnica = (id: string, ficha: Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'>) => {
    // Calcular custo dos ingredientes
    const ingredientesComCusto = calcularCustoIngredientes(ficha.ingredientes);
    const pesoTotal = calcularPesoIngredientes(ficha.ingredientes);
    const rendimentoTotal = calcularRendimentoTotal(
      ficha.ingredientes,
      ficha.unidadeRendimento
    );
    
    // Calcular custo total
    const custoTotal = ingredientesComCusto.reduce(
      (total: number, ingrediente: IngredienteFicha) => total + ingrediente.custo,
      0
    );
    
    // Calcular custo por porção
    const custoPorcao = rendimentoTotal > 0
      ? custoTotal / rendimentoTotal
      : 0;
    const custoPorKg = pesoTotal > 0 ? custoTotal / (pesoTotal / 1000) : 0;
    
    // Calcular informações nutricionais
    const { infoTotal, infoPorcao } = calcularInfoNutricional(
      ingredientesComCusto,
      rendimentoTotal
    );
    
    const fichaOriginal = fichasTecnicas.find((f: FichaTecnicaInfo) => f.id === id);
    
    const fichaAtualizada: FichaTecnicaInfo = {
      ...ficha,
      id,
      ingredientes: ingredientesComCusto,
      rendimentoTotal,
      custoTotal,
      custoPorcao,
      custoPorKg,
      infoNutricional: infoTotal,
      infoNutricionalPorcao: infoPorcao,
      dataCriacao: fichaOriginal?.dataCriacao || new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };
    
    const novasFichas = fichasTecnicas.map((f: FichaTecnicaInfo) =>
      f.id === id ? fichaAtualizada : f
    );
    
    setFichasTecnicas(novasFichas);
    salvarFichasTecnicas(novasFichas);
    return fichaAtualizada;
  };

  // Remover ficha técnica
  const removerFichaTecnica = (id: string) => {
    const novasFichas = fichasTecnicas.filter((f: FichaTecnicaInfo) => f.id !== id);
    setFichasTecnicas(novasFichas);
    salvarFichasTecnicas(novasFichas);
  };

  // Obter ficha técnica por ID
  const obterFichaTecnicaPorId = (id: string) => {
    return fichasTecnicas.find((f: FichaTecnicaInfo) => f.id === id);
  };

  return {
    fichasTecnicas,
    isLoading,
    adicionarFichaTecnica,
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

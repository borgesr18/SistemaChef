'use client';

import { useState, useEffect } from 'react';
import { useFichasTecnicas, FichaTecnicaInfo, IngredienteFicha } from './fichasTecnicasService';

// Tipos para produtos
export interface ProdutoInfo {
  id: string;
  nome: string;
  categoria: string;
  marca?: string;
  unidadeMedida: string;
  preco: number;
  /** Preço real por grama ou mililitro calculado a partir do peso/volume da embalagem */
  precoUnitario?: number;
  fornecedor: string;
  pesoEmbalagem?: number;
  imagem?: string;
  infoNutricional?: {
    calorias: number;
    carboidratos: number;
    proteinas: number;
    gordurasTotais: number;
    gordurasSaturadas: number;
    gordurasTrans: number;
    fibras: number;
    sodio: number;
  };
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

// Função para obter produtos da API
export const obterProdutos = async (): Promise<ProdutoInfo[]> => {
  try {
    const response = await fetch('/api/produtos', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    
    const produtos = await response.json();
    return produtos.map((p: any) => ({
      ...p,
      categoria: p.categoria ?? '',
      preco: Number(p.preco) || 0,
      precoUnitario: p.precoUnitario ? Number(p.precoUnitario) : undefined,
      pesoEmbalagem: p.pesoEmbalagem ? Number(p.pesoEmbalagem) : undefined,
      infoNutricional: p.infoNutricional
        ? {
            calorias: Number(p.infoNutricional.calorias) || 0,
            carboidratos: Number(p.infoNutricional.carboidratos) || 0,
            proteinas: Number(p.infoNutricional.proteinas) || 0,
            gordurasTotais: Number(p.infoNutricional.gordurasTotais) || 0,
            gordurasSaturadas: Number(p.infoNutricional.gordurasSaturadas) || 0,
            gordurasTrans: Number(p.infoNutricional.gordurasTrans) || 0,
            fibras: Number(p.infoNutricional.fibras) || 0,
            sodio: Number(p.infoNutricional.sodio) || 0
          }
        : undefined
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos da API:', error);
    return [];
  }
};

// Hook para gerenciar produtos
export const useProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fichasTecnicas, atualizarFichaTecnica } = useFichasTecnicas();

  // Carregar produtos da API ao inicializar
  useEffect(() => {
    const carregarProdutos = async () => {
      setIsLoading(true);
      const produtosArmazenados = await obterProdutos();
      setProdutos(produtosArmazenados);
      setIsLoading(false);
    };
    carregarProdutos();
  }, []);

  // Adicionar novo produto
  const adicionarProduto = async (produto: Omit<ProdutoInfo, 'id'>) => {
    try {
      const produtoData = {
        ...produto,
        precoUnitario:
          produto.pesoEmbalagem && produto.pesoEmbalagem > 0
            ? produto.preco / produto.pesoEmbalagem
            : undefined,
      };

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(produtoData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }

      const novoProduto = await response.json();
      const novosProdutos = [...produtos, novoProduto];
      setProdutos(novosProdutos);
      return novoProduto;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return null;
    }
  };

  // Atualizar produto existente
  const atualizarProduto = async (id: string, produto: Omit<ProdutoInfo, 'id'>) => {
    try {
      const produtoData = {
        ...produto,
        precoUnitario:
          produto.pesoEmbalagem && produto.pesoEmbalagem > 0
            ? produto.preco / produto.pesoEmbalagem
            : undefined,
      };

      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(produtoData)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      const produtoAtualizado = await response.json();
      const novosProdutos = produtos.map((p: ProdutoInfo) =>
        p.id === id ? produtoAtualizado : p
      );
      
      setProdutos(novosProdutos);
      
      // Atualizar fichas técnicas que usam este produto
      fichasTecnicas
        .filter(f => f.ingredientes.some(i => i.produtoId === id))
        .forEach(f => {
          const dados = {
            nome: f.nome,
            descricao: f.descricao,
            categoria: f.categoria,
            ingredientes: f.ingredientes.map(i => ({
              produtoId: i.produtoId,
              quantidade: i.quantidade,
              unidade: i.unidade,
            })) as Omit<IngredienteFicha, 'custo' | 'id'>[],
            modoPreparo: f.modoPreparo,
            tempoPreparo: f.tempoPreparo,
            rendimentoTotal: f.rendimentoTotal,
            unidadeRendimento: f.unidadeRendimento,
            observacoes: f.observacoes || '',
          } as Omit<
            FichaTecnicaInfo,
            'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'
          >;
          atualizarFichaTecnica(f.id, dados);
        });
      return produtoAtualizado;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
  };

  // Remover produto
  const removerProduto = async (id: string) => {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }

      const novosProdutos = produtos.filter((p: ProdutoInfo) => p.id !== id);
      setProdutos(novosProdutos);
      return true;
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      return false;
    }
  };

  // Obter produto por ID
  const obterProdutoPorId = (id: string) => {
    return produtos.find((p: ProdutoInfo) => p.id === id);
  };

  return {
    produtos,
    isLoading,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    obterProdutoPorId,
  };
};


// Categorias de produtos para classificacao em relatorios
export const categoriasProdutos = [
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'graos', label: 'Grãos e Cereais' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'temperos', label: 'Temperos' },
  { value: 'outros', label: 'Outros' },
];

// Obter rótulo legível de uma categoria pelo valor armazenado
export const obterLabelCategoria = (valor: string) => {
  if (!valor) return 'Não informado';
  const encontrado = categoriasProdutos.find(c => c.value === valor);
  return encontrado ? encontrado.label : valor;
};

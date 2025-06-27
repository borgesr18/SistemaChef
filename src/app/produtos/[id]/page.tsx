'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProdutos, obterLabelCategoria } from '@/lib/produtosService';

export default function DetalheInsumoPage() {
  const params = useParams();
  const router = useRouter();
  const { obterProdutoPorId, removerProduto } = useProdutos();
  
  const produtoId = params.id as string;
  const produto = obterProdutoPorId(produtoId);
  
  if (!produto) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Insumo não encontrado</h2>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <Button variant="default" onClick={() => router.push('/produtos')}>
          Voltar para Insumos
        </Button>
      </div>
    );
  }

  const handleRemover = () => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      removerProduto(produtoId);
      router.push('/produtos');
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Insumo</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/produtos')}
          >
            Voltar
          </Button>
          <Button 
            variant="default" 
            onClick={() => router.push(`/produtos/${produtoId}/editar`)}
          >
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleRemover}
          >
            Remover
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome do Insumo</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{produto.nome}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{obterLabelCategoria(produto.categoria)}</p>
            </div>

            {produto.marca && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Marca</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{produto.marca}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Unidade de Medida</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{produto.unidadeMedida}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Preço</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{formatarPreco(produto.preco)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fornecedor</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{produto.fornecedor}</p>
            </div>
          </div>
          
          {produto.infoNutricional && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Nutricionais (por 100g/100ml)</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Calorias</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.calorias} kcal</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Carboidratos</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.carboidratos} g</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Proteínas</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.proteinas} g</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Gorduras Totais</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.gordurasTotais} g</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Gorduras Saturadas</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.gordurasSaturadas} g</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Gorduras Trans</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.gordurasTrans} g</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Fibras</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.fibras} g</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Sódio</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">{produto.infoNutricional.sodio} mg</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

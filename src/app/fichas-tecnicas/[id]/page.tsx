'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  FichaTecnicaInfo,
  obterFichaTecnicaPorId,
  removerFichaTecnica,
  obterLabelUnidadeRendimento,
} from '@/lib/fichasTecnicasService';
import { useCategoriasReceita, obterLabelCategoriaReceita } from '@/lib/categoriasReceitasService';
import { useProdutos } from '@/lib/produtosService';
import Table, { TableRow, TableCell } from '@/components/ui/Table';

export default function DetalheFichaTecnicaPage() {
  const params = useParams();
  const router = useRouter();
  const [ficha, setFicha] = useState<FichaTecnicaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { produtos } = useProdutos();
  const { categorias: categoriasReceitas } = useCategoriasReceita();
  
  const fichaId = params.id as string;
  
  useEffect(() => {
    const loadFicha = async () => {
      try {
        setIsLoading(true);
        const fichaData = await obterFichaTecnicaPorId(fichaId);
        setFicha(fichaData);
      } catch (error) {
        console.error('Erro ao carregar ficha técnica:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (fichaId) {
      loadFicha();
    }
  }, [fichaId]);
  
  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }
  
  if (!ficha) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ficha técnica não encontrada</h2>
        <p className="text-gray-600 mb-6">A ficha técnica que você está procurando não existe ou foi removida.</p>
        <Button variant="primary" onClick={() => router.push('/fichas-tecnicas')}>
          Voltar para Fichas Técnicas
        </Button>
      </div>
    );
  }

  const handleRemover = async () => {
    if (confirm('Tem certeza que deseja remover esta ficha técnica?')) {
      try {
        const success = await removerFichaTecnica(fichaId);
        if (success) {
          router.push('/fichas-tecnicas');
        } else {
          alert('Erro ao remover ficha técnica');
        }
      } catch (error) {
        console.error('Erro ao remover ficha técnica:', error);
        alert('Erro ao remover ficha técnica');
      }
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const formatarData = (dataString: string) => {
    if (dataString === 'Data não disponível') {
      return dataString;
    }
    
    if (dataString.includes('/')) {
      return dataString;
    }
    
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return 'Data não disponível';
      }
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(data);
    } catch (error) {
      return 'Data não disponível';
    }
  };

  // Obter nome do produto pelo ID
  const getNomeProduto = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  };

  // Formatar quantidade com unidade de medida
  const formatarQuantidade = (unidade: string, quantidade: number) => {
    return `${quantidade} ${unidade}`;
  };

  // Formatar valor nutricional
  const formatarValorNutricional = (valor: number, unidade: string) => {
    return `${valor.toFixed(2)} ${unidade}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ficha Técnica</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => router.push('/fichas-tecnicas')}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/fichas-tecnicas/${fichaId}/editar`)}
          >
            Editar
          </Button>
          <Button
            variant="success"
            onClick={() => router.push(`/fichas-tecnicas/${fichaId}/imprimir`)}
          >
            Imprimir
          </Button>
          <Button
            variant="danger"
            onClick={handleRemover}
          >
            Remover
          </Button>
        </div>
      </div>
      
      <Card title="Informações Básicas">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome da Receita</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{ficha.nome}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{obterLabelCategoriaReceita(ficha.categoria, categoriasReceitas)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tempo de Preparo</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{ficha.tempoPreparo} minutos</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rendimento</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {ficha.rendimentoTotal} {obterLabelUnidadeRendimento(ficha.unidadeRendimento)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Data de Criação</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{formatarData(ficha.dataCriacao)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Data de Modificação</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{formatarData(ficha.dataModificacao)}</p>
          </div>
        </div>

        {ficha.descricao && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
            <p className="mt-1 text-gray-700">{ficha.descricao}</p>
          </div>
        )}
      </Card>

      <Card title="Custos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Custo Total</h3>
            <p className="mt-1 text-xl font-medium text-gray-900">{formatarPreco(ficha.custoTotal)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Custo por Kg</h3>
            <p className="mt-1 text-xl font-medium text-gray-900">{formatarPreco(ficha.custoPorKg)}</p>
          </div>
        </div>
      </Card>
      
      <Card title="Ingredientes">
        <Table
          headers={['Produto', 'Quantidade', 'Custo']}
        >
          {ficha.ingredientes.map((ingrediente, index) => (
            <TableRow key={index}>
              <TableCell>{getNomeProduto(ingrediente.produtoId)}</TableCell>
              <TableCell>{formatarQuantidade(ingrediente.unidade, ingrediente.quantidade)}</TableCell>
              <TableCell>{formatarPreco(ingrediente.custo)}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
      
      <Card title="Modo de Preparo">
        <div className="whitespace-pre-line text-gray-700">
          {ficha.modoPreparo}
        </div>
      </Card>
      
      {ficha.infoNutricional && (
        <Card title="Informações Nutricionais">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Por Receita Completa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Calorias</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricional.calorias, 'kcal')}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Carboidratos</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricional.carboidratos, 'g')}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Proteínas</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricional.proteinas, 'g')}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Gorduras Totais</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricional.gordurasTotais, 'g')}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Por Porção</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Calorias</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricionalPorcao?.calorias ?? 0, 'kcal')}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Carboidratos</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricionalPorcao?.carboidratos ?? 0, 'g')}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Proteínas</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricionalPorcao?.proteinas ?? 0, 'g')}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Gorduras Totais</h4>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {formatarValorNutricional(ficha.infoNutricionalPorcao?.gordurasTotais ?? 0, 'g')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {ficha.observacoes && (
        <Card title="Observações">
          <div className="whitespace-pre-line text-gray-700">
            {ficha.observacoes}
          </div>
        </Card>
      )}
    </div>
  );
}

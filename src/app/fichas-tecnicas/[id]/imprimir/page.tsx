'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { useFichasTecnicas, obterLabelCategoriaReceita, obterLabelUnidadeRendimento } from '@/lib/fichasTecnicasService';
import { useProdutos } from '@/lib/produtosService';
import Table, { TableRow, TableCell } from '@/components/ui/Table';

export default function ImprimirFichaTecnicaPage() {
  const params = useParams();
  const { obterFichaTecnicaPorId } = useFichasTecnicas();
  const { produtos } = useProdutos();
  const router = useRouter();

  const fichaId = params.id as string;
  const ficha = obterFichaTecnicaPorId(fichaId);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      const handleAfterPrint = () => router.back();
      window.addEventListener('afterprint', handleAfterPrint);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [router]);

  if (!ficha) {
    return (
      <div className="p-8 text-center">Ficha técnica não encontrada</div>
    );
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  const getNomeProduto = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  };

  const formatarQuantidade = (unidade: string, quantidade: number) => {
    return `${quantidade} ${unidade}`;
  };

  const formatarValorNutricional = (valor: number, unidade: string) => {
    return `${valor.toFixed(2)} ${unidade}`;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-end print:hidden mb-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">Ficha Técnica</h1>
      <Card title="Informações Básicas">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome da Receita</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{ficha.nome}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Categoria</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{obterLabelCategoriaReceita(ficha.categoria)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tempo de Preparo</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{ficha.tempoPreparo} minutos</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rendimento</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{ficha.rendimentoTotal} {obterLabelUnidadeRendimento(ficha.unidadeRendimento)}</p>
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
        <Table headers={['Produto', 'Quantidade', 'Custo']}>
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

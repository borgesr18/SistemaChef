'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { useRelatorios } from '@/lib/relatoriosService';
import { useProdutos } from '@/lib/produtosService';
import { useFichasTecnicas } from '@/lib/fichasTecnicasService';

export default function DashboardPage() {
  const { gerarRelatorioCompleto } = useRelatorios();
  const { produtos } = useProdutos();
  const { fichasTecnicas } = useFichasTecnicas();
  
  const relatorio = gerarRelatorioCompleto();
  
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500">Total de Produtos</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{relatorio.totalProdutos}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500">Total de Fichas Técnicas</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{relatorio.totalFichasTecnicas}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500">Custo Total Estimado</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatarPreco(relatorio.custoTotalEstoque)}</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-500">Custo Médio por Ficha</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatarPreco(relatorio.custoMedioPorFicha)}</p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Fichas Técnicas Mais Caras">
          <div className="space-y-4">
            {relatorio.fichasMaisCustos.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {relatorio.fichasMaisCustos.map((ficha, index) => (
                  <li key={ficha.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-medium">{ficha.nome}</span>
                    </div>
                    <span className="text-gray-700 font-medium">{formatarPreco(ficha.custo)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
            )}
          </div>
        </Card>
        
        <Card title="Fichas Técnicas Mais Econômicas">
          <div className="space-y-4">
            {relatorio.fichasMenosCustos.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {relatorio.fichasMenosCustos.map((ficha, index) => (
                  <li key={ficha.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-medium">{ficha.nome}</span>
                    </div>
                    <span className="text-gray-700 font-medium">{formatarPreco(ficha.custo)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
            )}
          </div>
        </Card>
      </div>
      
      <Card title="Ingredientes Mais Utilizados">
        <div className="space-y-4">
          {relatorio.ingredientesMaisUsados.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {relatorio.ingredientesMaisUsados.map((ingrediente) => (
                <li key={ingrediente.id} className="py-3 flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{ingrediente.nome}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">{ingrediente.quantidade} {ingrediente.unidade}</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {ingrediente.ocorrencias} {ingrediente.ocorrencias === 1 ? 'receita' : 'receitas'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum ingrediente utilizado</p>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Distribuição de Categorias de Produtos">
          <div className="space-y-4">
            {relatorio.distribuicaoCategoriasProdutos.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {relatorio.distribuicaoCategoriasProdutos.map((categoria) => (
                  <li key={categoria.categoria} className="py-3 flex justify-between items-center">
                    <span className="text-gray-900">{categoria.categoria}</span>
                    <div className="flex items-center">
                      <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(categoria.quantidade / relatorio.totalProdutos) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700">{categoria.quantidade}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
            )}
          </div>
        </Card>
        
        <Card title="Distribuição de Categorias de Receitas">
          <div className="space-y-4">
            {relatorio.distribuicaoCategoriasReceitas.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {relatorio.distribuicaoCategoriasReceitas.map((categoria) => (
                  <li key={categoria.categoria} className="py-3 flex justify-between items-center">
                    <span className="text-gray-900">{categoria.categoria}</span>
                    <div className="flex items-center">
                      <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${(categoria.quantidade / relatorio.totalFichasTecnicas) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700">{categoria.quantidade}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma ficha técnica cadastrada</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

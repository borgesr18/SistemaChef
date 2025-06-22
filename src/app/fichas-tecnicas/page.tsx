'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SlideOver from '@/components/ui/SlideOver';
import {
  FichaTecnicaInfo,
  obterLabelCategoriaReceita,
  removerFichaTecnica,
  obterFichasTecnicas
} from '@/lib/fichasTecnicasService';
import Link from 'next/link';

export default function FichasTecnicasPage() {
  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selecionada, setSelecionada] = useState<FichaTecnicaInfo | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    obterFichasTecnicas()
      .then((data) => {
        setFichasTecnicas(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar fichas técnicas:', error);
        setFichasTecnicas([]);
        setIsLoading(false);
      });
  }, []);

  const handleRemover = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta ficha técnica?')) {
      const success = await removerFichaTecnica(id);
      if (success) {
        setFichasTecnicas(prev => prev.filter(f => f.id !== id));
        setSelecionada(null);
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
    if (!dataString) return 'Data não disponível';
    
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return 'Data inválida';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Fichas Técnicas</h1>
        <Link href="/fichas-tecnicas/nova">
          <Button variant="primary">
            <span className="material-icons mr-1 text-sm">add</span>
            Nova Ficha Técnica
          </Button>
        </Link>
      </div>

      <Card>
        <Table
          headers={[
            'Nome',
            'Categoria',
            'Rendimento',
            'Custo Total',
            'Data de Modificação'
          ]}
          isLoading={isLoading}
          emptyMessage="Nenhuma ficha técnica cadastrada. Clique em 'Nova Ficha Técnica' para adicionar."
        >
          {fichasTecnicas.map((ficha: FichaTecnicaInfo) => (
            <TableRow
              key={ficha.id}
              className="relative cursor-pointer"
              onClick={() => setSelecionada(ficha)}
            >
              <TableCell className="font-medium text-gray-700">{ficha.nome}</TableCell>
              <TableCell>{obterLabelCategoriaReceita(ficha.categoria)}</TableCell>
              <TableCell>{ficha.rendimentoTotal} {ficha.unidadeRendimento}</TableCell>
              <TableCell>{formatarPreco(ficha.custoTotal)}</TableCell>
              <TableCell>{formatarData(ficha.dataModificacao)}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
      <SlideOver
        isOpen={!!selecionada}
        onClose={() => setSelecionada(null)}
        title={selecionada?.nome}
      >
        {selecionada && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Rendimento: {selecionada.rendimentoTotal} {selecionada.unidadeRendimento}
            </p>
            <p className="text-sm text-gray-600">Custo Total: {formatarPreco(selecionada.custoTotal)}</p>
            <p className="text-sm text-gray-600">Data: {formatarData(selecionada.dataModificacao)}</p>
            <div className="flex flex-col space-y-2">
              <Link href={`/fichas-tecnicas/${selecionada.id}`}>
                <Button variant="secondary" fullWidth>Ver</Button>
              </Link>
              <Link href={`/fichas-tecnicas/${selecionada.id}/editar`}>
                <Button variant="primary" fullWidth>Editar</Button>
              </Link>
              <Button variant="danger" fullWidth onClick={() => handleRemover(selecionada.id)}>
                Excluir
              </Button>
              <Link href={`/producao?ficha=${selecionada.id}`}>
                <Button fullWidth>Produzir</Button>
              </Link>
              <Link href={`/precos?ficha=${selecionada.id}`}>
                <Button fullWidth>Calcular Preço</Button>
              </Link>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

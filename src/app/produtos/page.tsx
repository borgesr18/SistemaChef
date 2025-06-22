'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import SlideOver from '@/components/ui/SlideOver';
import { useProdutos, ProdutoInfo, obterLabelCategoria } from '@/lib/produtosService';
import Link from 'next/link';

export default function ProdutosPage() {
  const { produtos, isLoading, removerProduto } = useProdutos();

  const [selecionado, setSelecionado] = useState<ProdutoInfo | null>(null);

  const handleRemover = (id: string) => {
    if (confirm('Tem certeza que deseja remover este insumo?')) {
      removerProduto(id);
      setSelecionado(null);
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
        <h1 className="text-2xl font-bold text-gray-800">Insumos</h1>
        <Link href="/produtos/novo">
          <Button variant="primary">
            <span className="material-icons mr-1 text-sm">add</span>
            Novo Insumo
          </Button>
        </Link>
      </div>

      <Card>
        <Table
          headers={['Nome', 'Categoria', 'Unidade', 'Preço', 'Fornecedor']}
          isLoading={isLoading}
          emptyMessage="Nenhum insumo cadastrado. Clique em 'Novo Insumo' para adicionar."
          className="text-sm"
        >
          {produtos
            .slice()
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((produto: ProdutoInfo) => (
              <TableRow
                key={produto.id}
                className="relative cursor-pointer"
                onClick={() => setSelecionado(produto)}
              >
                <TableCell className="font-medium text-gray-700">{produto.nome}</TableCell>
                <TableCell>{obterLabelCategoria(produto.categoria)}</TableCell>
                <TableCell>{produto.unidadeMedida}</TableCell>
                <TableCell>{formatarPreco(produto.preco)}</TableCell>
                <TableCell>{produto.fornecedor}</TableCell>
              </TableRow>
            ))}
        </Table>
      </Card>
      <SlideOver
        isOpen={!!selecionado}
        onClose={() => setSelecionado(null)}
        title={selecionado?.nome}
      >
        {selecionado && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Categoria: {obterLabelCategoria(selecionado.categoria)}</p>
            <p className="text-sm text-gray-600">Preço: {formatarPreco(selecionado.preco)}</p>
            <div className="flex flex-col space-y-2">
              <Link href={`/produtos/${selecionado.id}`}> <Button variant="secondary" fullWidth>Ver</Button> </Link>
              <Link href={`/produtos/${selecionado.id}/editar`}> <Button variant="primary" fullWidth>Editar</Button> </Link>
              <Button variant="danger" fullWidth onClick={() => handleRemover(selecionado.id)}>Excluir</Button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}

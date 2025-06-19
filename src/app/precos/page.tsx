'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { useProducao, ProducaoInfo } from '@/lib/producaoService';
import { useFichasTecnicas, FichaTecnicaInfo } from '@/lib/fichasTecnicasService';
import { usePrecosVenda, EstrategiaPreco } from '@/lib/precosService';

export default function PrecosPage() {
  const { producoes } = useProducao();
  const { fichasTecnicas } = useFichasTecnicas();
  const { estrategias, salvarEstrategia, removerEstrategia, obterPorProducao } = usePrecosVenda();

  const [selecionada, setSelecionada] = useState('');
  const [lucros, setLucros] = useState({ lucro1: '', lucro2: '', lucro3: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [menuRow, setMenuRow] = useState<string | null>(null);

  const prod = producoes.find(p => p.id === selecionada);
  const custoUnit = prod?.custoUnitario || 0;
  const formatar = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const calcPreco = (lucroStr: string) => {
    const perc = parseFloat(lucroStr);
    if (isNaN(perc)) return 0;
    return custoUnit + (custoUnit * perc) / 100;
  };

  const formatarData = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prod) return;
    salvarEstrategia(
      {
        producaoId: prod.id,
        fichaId: prod.fichaId,
        custoUnitario: custoUnit,
        lucro1: parseFloat(lucros.lucro1) || 0,
        preco1: calcPreco(lucros.lucro1),
        lucro2: parseFloat(lucros.lucro2) || 0,
        preco2: calcPreco(lucros.lucro2),
        lucro3: parseFloat(lucros.lucro3) || 0,
        preco3: calcPreco(lucros.lucro3),
      },
      editId || obterPorProducao(prod.id)?.id
    );
    setLucros({ lucro1: '', lucro2: '', lucro3: '' });
    setEditId(null);
  };

  const carregarEstrategia = (est: EstrategiaPreco) => {
    setSelecionada(est.producaoId);
    setLucros({
      lucro1: est.lucro1.toString(),
      lucro2: est.lucro2.toString(),
      lucro3: est.lucro3.toString(),
    });
    setEditId(est.id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Preços de Venda</h1>
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            label="Produto Produzido"
            name="producao"
            value={selecionada}
            onChange={e => setSelecionada(e.target.value)}
            options={producoes.map(p => {
              const f = fichasTecnicas.find(ft => ft.id === p.fichaId);
              const label = f ? `${f.nome} (${formatarData(p.data)})` : p.id;
              return { value: p.id, label };
            })}
          />
          <Input label="Custo Unitário" readOnly value={prod ? formatar(custoUnit) : ''} />
          <Input label="Lucro % Preço 1" name="lucro1" value={lucros.lucro1} onChange={e => setLucros(prev => ({ ...prev, lucro1: e.target.value }))} />
          <Input label="Lucro % Preço 2" name="lucro2" value={lucros.lucro2} onChange={e => setLucros(prev => ({ ...prev, lucro2: e.target.value }))} />
          <Input label="Lucro % Preço 3" name="lucro3" value={lucros.lucro3} onChange={e => setLucros(prev => ({ ...prev, lucro3: e.target.value }))} />
          <div className="md:col-span-6 flex justify-end">
            <Button type="submit" variant="primary">Salvar Estratégia</Button>
          </div>
        </form>
      </Card>
      <Card title="Estratégias Salvas">
        <Table headers={["Ficha", "Data", "Custo", "Preço 1", "Preço 2", "Preço 3", "Ações"]} emptyMessage="Nenhuma estratégia registrada">
          {estrategias.map((e: EstrategiaPreco) => {
            const prodRef = producoes.find(p => p.id === e.producaoId);
            const fichaRef = fichasTecnicas.find(f => f.id === e.fichaId);
            return (
              <TableRow key={e.id}>
                <TableCell>{fichaRef?.nome || e.fichaId}</TableCell>
                <TableCell>{prodRef ? formatarData(prodRef.data) : ''}</TableCell>
                <TableCell>{formatar(e.custoUnitario)}</TableCell>
                <TableCell>{formatar(e.preco1)}</TableCell>
                <TableCell>{formatar(e.preco2)}</TableCell>
                <TableCell>{formatar(e.preco3)}</TableCell>
                <TableCell className="relative text-right">
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    onClick={() => setMenuRow(menuRow === e.id ? null : e.id)}
                  >
                    <span className="material-icons text-gray-600">more_vert</span>
                  </button>
                  {menuRow === e.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center"
                        onClick={() => {
                          setMenuRow(null);
                          carregarEstrategia(e);
                        }}
                      >
                        <span className="material-icons mr-1 text-black text-sm">edit</span>
                        Alterar
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center text-red-600"
                        onClick={() => {
                          setMenuRow(null);
                          removerEstrategia(e.id);
                        }}
                      >
                        <span className="material-icons mr-1 text-black text-sm">delete</span>
                        Excluir
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

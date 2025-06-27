'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { useEstoqueProducao } from '@/lib/estoqueProducaoService';
import { useFichasTecnicas, FichaTecnicaInfo } from '@/lib/fichasTecnicasService';

export default function EstoqueProducaoPage() {
  const { movimentacoes, calcularEstoqueAtual, registrarEntrada, registrarSaida } = useEstoqueProducao();
  const { fichasTecnicas } = useFichasTecnicas();

  const [form, setForm] = useState({ fichaId: '', tipo: 'saida', quantidade: '', validade: '' });
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fichaId || !form.quantidade || isNaN(Number(form.quantidade))) {
      setErro('Dados inválidos');
      return;
    }
    if (form.tipo === 'entrada') {
      registrarEntrada({ fichaId: form.fichaId, quantidade: Number(form.quantidade), validade: form.validade });
    } else {
      registrarSaida({ fichaId: form.fichaId, quantidade: Number(form.quantidade) });
    }
    setForm({ fichaId: '', tipo: 'saida', quantidade: '', validade: '' });
    setErro('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Estoque de Produção</h1>
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Ficha Técnica *"
            name="fichaId"
            value={form.fichaId}
            onChange={handleChange}
            options={fichasTecnicas
              .map((f: FichaTecnicaInfo) => ({ value: f.id, label: f.nome }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            error={erro && !form.fichaId ? erro : undefined}
          />
          <Select
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={[{ value: 'entrada', label: 'Entrada' }, { value: 'saida', label: 'Saída' }]}
          />
          <Input
            label="Quantidade *"
            name="quantidade"
            value={form.quantidade}
            onChange={handleChange}
            error={erro && !form.quantidade ? erro : undefined}
          />
          {form.tipo === 'entrada' && (
            <Input
              label="Validade"
              type="date"
              name="validade"
              value={form.validade}
              onChange={handleChange}
            />
          )}
          <div className="flex items-end">
            <Button type="submit" variant="primary">Registrar</Button>
          </div>
        </form>
      </Card>
      <Card title="Histórico de Produção">
        <Table
          headers={["Ficha Técnica", "Quantidade", "Data", "Validade", "Estoque Total"]}
          emptyMessage="Nenhuma movimentação"
        >
          {(() => {
            const acumulados: Record<string, number> = {};
            return movimentacoes
              .slice()
              .sort((a, b) => a.data.localeCompare(b.data))
              .map(m => {
                acumulados[m.fichaId] = (acumulados[m.fichaId] || 0) + m.quantidade;
                const total = acumulados[m.fichaId];
                const ficha = fichasTecnicas.find(f => f.id === m.fichaId);
                return (
                  <TableRow key={m.id}>
                    <TableCell>{ficha?.nome || 'Ficha removida'}</TableCell>
                    <TableCell>{m.quantidade}</TableCell>
                    <TableCell>{new Date(m.data).toLocaleDateString()}</TableCell>
                    <TableCell>{m.validade ? new Date(m.validade).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{total}</TableCell>
                  </TableRow>
                );
              });
          })()}
        </Table>
      </Card>
      <Card title="Estoque Atual">
        <Table headers={["Ficha Técnica", "Quantidade"]} emptyMessage="Nenhum produto produzido">
          {fichasTecnicas.map((f: FichaTecnicaInfo) => {
            const qtd = calcularEstoqueAtual(f.id);
            if (qtd === 0) return null;
            return (
              <TableRow key={f.id}>
                <TableCell>{f.nome}</TableCell>
                <TableCell>{qtd}</TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

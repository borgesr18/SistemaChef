'use client';

import React, { useState, useRef } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useUnidadesMedida } from '@/lib/unidadesService';

export default function UnidadesConfigPage() {
  const { unidades, adicionarUnidade, atualizarUnidade, removerUnidade } = useUnidadesMedida();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const [nova, setNova] = useState({ id: '', nome: '' });
  const [editar, setEditar] = useState({ id: '', nome: '' });
  const [filtro, setFiltro] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarUnidade(nova.id.trim(), nova.nome.trim());
    setNova({ id: '', nome: '' });
    closeModal();
  };

  const iniciarEdicao = (id: string, nome: string) => {
    setEditar({ id, nome });
    openEdit();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarUnidade(editar.id, editar.nome.trim());
    closeEdit();
  };

  const handleExport = () => {
    const data = JSON.stringify(unidades, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unidades.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as { id: string; nome: string }[];
        data.forEach(d => d.id && adicionarUnidade(d.id, d.nome));
      } catch (err) {
        console.error('Erro ao importar unidades', err);
      }
    };
    reader.readAsText(file);
  };

  const filtradas = unidades.filter(u =>
    u.id.toLowerCase().includes(filtro.toLowerCase()) ||
    u.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Unidades de Medida</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button onClick={openModal} variant="default">➕ Nova Unidade</Button>
          <Button onClick={handleExport} variant="secondary">⬇️ Exportar</Button>
          <Button onClick={() => fileInput.current?.click()} variant="secondary">⬆️ Importar</Button>
        </div>
        <div className="w-full sm:w-[220px]">
          <Input
            placeholder="Buscar..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="h-[38px]"
          />
        </div>
      </div>

      <input
        type="file"
        ref={fileInput}
        className="hidden"
        accept="application/json"
        onChange={handleImport}
      />

      <div className="pt-2">
        <Table headers={["Sigla", "Nome", "Ações"]}>
          {filtradas.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nome}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(u.id, u.nome)}>
                  ✏️ Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removerUnidade(u.id)}>
                  🗑️ Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Modal Nova Unidade */}
      <Modal isOpen={isOpen} onClose={closeModal} title="Nova Unidade">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            placeholder="Sigla"
            value={nova.id}
            onChange={e => setNova({ ...nova, id: e.target.value })}
            required
            className="h-[38px]"
          />
          <Input
            placeholder="Nome"
            value={nova.nome}
            onChange={e => setNova({ ...nova, nome: e.target.value })}
            required
            className="h-[38px]"
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" variant="default">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Unidade */}
      <Modal isOpen={isEditOpen} onClose={closeEdit} title="Editar Unidade">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            placeholder="Sigla"
            value={editar.id}
            disabled
            className="h-[38px]"
          />
          <Input
            placeholder="Nome"
            value={editar.nome}
            onChange={e => setEditar({ ...editar, nome: e.target.value })}
            required
            className="h-[38px]"
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeEdit}>Cancelar</Button>
            <Button type="submit" variant="default">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

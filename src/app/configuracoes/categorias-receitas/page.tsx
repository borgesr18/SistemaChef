'use client';

import { useState, useRef } from 'react';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal, { useModal } from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useCategoriasReceita } from '@/lib/categoriasReceitasService';

export default function CategoriasReceitasConfigPage() {
  const { categorias, adicionar, atualizar, remover } = useCategoriasReceita();
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const [nova, setNova] = useState('');
  const [editar, setEditar] = useState({ id: '', nome: '' });
  const [filtro, setFiltro] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    adicionar(nova.trim());
    setNova('');
    closeModal();
  };

  const iniciarEdicao = (id: string, nome: string) => {
    setEditar({ id, nome });
    openEdit();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizar(editar.id, editar.nome.trim());
    closeEdit();
  };

  const handleExport = () => {
    const data = JSON.stringify(categorias, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categorias-receitas.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as { nome: string }[];
        data.forEach((d) => d.nome && adicionar(d.nome));
      } catch (err) {
        console.error('Erro ao importar categorias de receitas', err);
      }
    };
    reader.readAsText(file);
  };

  const filtradas = categorias.filter((c) =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Categorias de Receitas</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2 grow">
          <Button onClick={openModal} variant="primary">➕ Nova Categoria</Button>
          <Button onClick={handleExport} variant="secondary">⬇️ Exportar</Button>
          <Button onClick={() => fileInput.current?.click()} variant="secondary">⬆️ Importar</Button>
        </div>
        <div className="w-full sm:w-[220px]">
          <Input
            label=""
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
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
        <Table headers={['Nome', 'Ações']}>
          {filtradas.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.nome}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <Button size="sm" variant="secondary" onClick={() => iniciarEdicao(cat.id, cat.nome)}>
                  ✏️ Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => remover(cat.id)}>
                  🗑️ Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Modal Nova Categoria */}
      <Modal isOpen={isOpen} onClose={closeModal} title="Nova Categoria">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Nome"
            value={nova}
            onChange={(e) => setNova(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Categoria */}
      <Modal isOpen={isEditOpen} onClose={closeEdit} title="Editar Categoria">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Nome"
            value={editar.nome}
            onChange={(e) => setEditar({ ...editar, nome: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={closeEdit}>Cancelar</Button>
            <Button type="submit" variant="primary">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

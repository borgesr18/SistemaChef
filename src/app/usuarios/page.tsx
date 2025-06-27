'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUsuarios } from '@/lib/usuariosService';
import { Pencil, Trash, Plus } from 'lucide-react';

export default function UsuariosPage() {
  const router = useRouter();
  const {
    usuarioAtual,
    usuarios,
    isLoading,
    editarUsuario,
    removerUsuario,
  } = useUsuarios();

  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!usuarioAtual || usuarioAtual.role !== 'admin') {
      router.replace('/login');
    }
  }, [usuarioAtual, router]);

  const handleEditar = async (id: number, nome: string, role: string) => {
    const novoNome = prompt('Novo nome:', nome);
    const novoRole = prompt('Novo perfil (admin, editor, viewer, manager):', role);

    if (novoNome && novoRole) {
      const sucesso = await editarUsuario(id, {
        nome: novoNome,
        role: novoRole as 'admin' | 'editor' | 'viewer' | 'manager',
      });

      if (!sucesso) setErro('Erro ao editar usuário');
    }
  };

  const handleRemover = async (id: number, nome: string) => {
    const confirmacao = confirm(`Tem certeza que deseja remover o usuário "${nome}"?`);
    if (confirmacao) {
      const sucesso = await removerUsuario(id);
      if (!sucesso) setErro('Erro ao remover usuário');
    }
  };

  if (!usuarioAtual || usuarioAtual.role !== 'admin') return null;

  return (
    <div className="p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Gerenciar Usuários</h1>
          <Button onClick={() => router.push('/usuarios/novo')} icon={Plus}>
            Novo Usuário
          </Button>
        </div>

        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

        {isLoading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border">Nome</th>
                  <th className="text-left p-2 border">Email</th>
                  <th className="text-left p-2 border">Perfil</th>
                  <th className="text-left p-2 border">Ativo</th>
                  <th className="text-left p-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b">
                    <td className="p-2 border">{usuario.nome}</td>
                    <td className="p-2 border">{usuario.user_id}</td>
                    <td className="p-2 border capitalize">{usuario.role}</td>
                    <td className="p-2 border">{usuario.ativo ? 'Sim' : 'Não'}</td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleEditar(usuario.id, usuario.nome, usuario.role)}
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleRemover(usuario.id, usuario.nome)}
                        title="Excluir"
                      >
                        <Trash size={18} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

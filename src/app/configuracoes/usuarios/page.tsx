'use client';

import { useUsuarios } from '@/lib/usuariosService';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Pencil, Trash } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function UsuariosConfigPage() {
  const router = useRouter();
  const { usuarios, usuarioAtual, removerUsuario } = useUsuarios();

  useEffect(() => {
    if (!usuarioAtual || usuarioAtual.role !== 'admin') {
      router.replace('/login');
    }
  }, [usuarioAtual, router]);

  if (!usuarioAtual || usuarioAtual.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
        <Button onClick={() => router.push('/usuarios/novo')}>+ Novo Usuário</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Perfil</th>
              <th className="px-4 py-2 text-left">Ativo</th>
              <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t text-sm">
                <td className="px-4 py-2">{usuario.nome}</td>
                <td className="px-4 py-2">{usuario.user_id}</td>
                <td className="px-4 py-2">{usuario.role}</td>
                <td className="px-4 py-2">{usuario.ativo ? 'Sim' : 'Não'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => alert('Função de editar ainda não implementada')}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => removerUsuario(usuario.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

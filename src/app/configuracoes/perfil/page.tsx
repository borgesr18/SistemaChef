'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';
import { useUsuarios } from '@/lib/usuariosService';

export default function PerfilPage() {
  const { usuarioAtual, alterarSenha, editarUsuario } = useUsuarios();

  const [perfilForm, setPerfilForm] = useState<{
    nome: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer' | 'manager';
  }>({
    nome: '',
    email: '',
    role: 'viewer',
  });

  const [senhaForm, setSenhaForm] = useState({ senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (usuarioAtual) {
      setPerfilForm({
        nome: usuarioAtual.nome,
        email: usuarioAtual.email,
        role: usuarioAtual.role,
      });
    }
  }, [usuarioAtual]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!usuarioAtual) return <p className="p-4">Nenhum usuário logado.</p>;

  const handlePerfil = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = editarUsuario(usuarioAtual.id, perfilForm);
    if (ok) {
      setToast('Perfil atualizado');
      setErro('');
    } else {
      setErro('Email já cadastrado');
    }
  };

  const handleSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaForm.senha !== senhaForm.confirmar) {
      setErro('Senhas não conferem');
      return;
    }
    alterarSenha(usuarioAtual.id, senhaForm.senha);
    setSenhaForm({ senha: '', confirmar: '' });
    setErro('');
    setToast('Senha alterada');
  };

  return (
    <div className="space-y-6">
      <Toast message={toast} onClose={() => setToast('')} />
      <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>

      {/* Formulário de dados do perfil */}
      <form onSubmit={handlePerfil} className="space-y-4 max-w-sm">
        <Input
          placeholder="Nome"
          value={perfilForm.nome}
          onChange={e => setPerfilForm({ ...perfilForm, nome: e.target.value })}
          required
          className="h-[38px]"
        />
        <Input
          placeholder="Email"
          type="email"
          value={perfilForm.email}
          onChange={e => setPerfilForm({ ...perfilForm, email: e.target.value })}
          required
          className="h-[38px]"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
          <select
            value={perfilForm.role}
            onChange={e => setPerfilForm({ ...perfilForm, role: e.target.value as 'admin' | 'editor' | 'viewer' | 'manager' })}
            className="border border-[var(--cor-borda)] rounded-md p-2 w-full h-[38px] text-sm"
          >
            <option value="viewer">Visualizador</option>
            <option value="editor">Editor</option>
            <option value="manager">Gerente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="flex justify-end">
          <Button type="submit" variant="default">Salvar Perfil</Button>
        </div>
      </form>

      {/* Formulário de alteração de senha */}
      <form onSubmit={handleSenha} className="space-y-4 max-w-sm">
        <Input
          placeholder="Nova Senha"
          type="password"
          value={senhaForm.senha}
          onChange={e => setSenhaForm({ ...senhaForm, senha: e.target.value })}
          required
          className="h-[38px]"
        />
        <Input
          placeholder="Confirmar Senha"
          type="password"
          value={senhaForm.confirmar}
          onChange={e => setSenhaForm({ ...senhaForm, confirmar: e.target.value })}
          required
          className="h-[38px]"
        />
        <div className="flex justify-end">
          <Button type="submit" variant="default">Alterar Senha</Button>
        </div>
      </form>
    </div>
  );
}

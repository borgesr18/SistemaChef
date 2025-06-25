'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { useAuth } from '@/contexts/AuthContext';

export interface PerfilUsuario {
  id: number;
  user_id: string;
  nome: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  ativo: boolean;
  created_at: string;
}

export const useUsuarios = () => {
  const { user, signOut } = useAuth();
  const [usuarioAtual, setUsuarioAtual] = useState<PerfilUsuario | null>(null);
  const [usuarios, setUsuarios] = useState<PerfilUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregarUsuarioAtual = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return;
    }

    setUsuarioAtual(data);
  };

  const carregarTodos = async () => {
    const { data, error } = await supabase
      .from('perfis_usuarios')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar lista de usuários:', error);
      return;
    }

    setUsuarios(data || []);
  };

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        await carregarUsuarioAtual();
        await carregarTodos();
      }
      setIsLoading(false);
    };
    fetch();
  }, [user]);

  const logout = async () => {
    await signOut();
    setUsuarioAtual(null);
  };

  const registrarUsuario = async ({
    nome,
    email,
    senha,
    role,
  }: {
    nome: string;
    email: string;
    senha: string;
    role: 'admin' | 'editor' | 'viewer' | 'manager';
  }) => {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (error || !data?.user?.id) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }

    const { error: insertError } = await supabase
      .from('perfis_usuarios')
      .insert({
        user_id: data.user.id,
        nome,
        role,
        ativo: true,
      });

    if (insertError) {
      console.error('Erro ao inserir perfil:', insertError);
      return false;
    }

    await carregarTodos();
    return true;
  };

  const editarUsuario = async (
    id: number | string,
    { nome, role }: { nome: string; role: 'admin' | 'editor' | 'viewer' | 'manager' }
  ) => {
    const { error } = await supabase
      .from('perfis_usuarios')
      .update({ nome, role })
      .eq('id', id);

    if (error) {
      console.error('Erro ao editar usuário:', error);
      return false;
    }

    await carregarTodos();
    return true;
  };

  const alterarSenha = async (userId: string, novaSenha: string) => {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: novaSenha,
    });

    if (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }

    return true;
  };

  const removerUsuario = async (id: number | string) => {
    const { error } = await supabase
      .from('perfis_usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover usuário:', error);
      return false;
    }

    await carregarTodos();
    return true;
  };

  return {
    usuarioAtual,
    usuarios,
    isLoading,
    logout,
    registrarUsuario,
    editarUsuario,
    alterarSenha,
    removerUsuario,
  };
};


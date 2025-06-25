'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { useAuth } from '@/contexts/AuthContext';

export interface PerfilUsuario {
  id: number;
  user_id: string;
  nome: string;
  perfil: string;
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

    setUsuarios(data);
  };

  useEffect(() => {
    if (user) {
      carregarUsuarioAtual();
      carregarTodos();
    }
    setIsLoading(false);
  }, [user]);

  const logout = async () => {
    await signOut();
    setUsuarioAtual(null);
  };

  return {
    usuarioAtual,
    usuarios,
    isLoading,
    logout,
  };
};

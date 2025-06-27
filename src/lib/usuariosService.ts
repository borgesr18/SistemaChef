// 📁 src/lib/usuariosService.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  ativo: boolean;
}

export const listarUsuarios = async () => {
  const { data, error } = await supabase
    .from('perfis_usuarios')
    .select('id, nome, papel');

  if (error) {
    console.error('Erro ao listar usuários:', error.message);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

export const buscarUsuarioPorId = async (id: string) => {
  const { data, error } = await supabase
    .from('perfis_usuarios')
    .select('id, nome, papel')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar usuário por ID:', error.message);
    return null;
  }

  return data;
};

export const criarUsuario = async (usuario: {
  nome: string;
  email: string;
  senha: string;
  papel: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: usuario.email,
    password: usuario.senha,
    options: {
      data: {
        nome: usuario.nome,
        papel: usuario.papel,
      },
    },
  });

  if (error) {
    console.error('Erro ao criar usuário:', error.message);
    return null;
  }

  return data;
};

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setIsLoading(true);
        const data = await listarUsuarios();
        setUsuarios(data as Usuario[]);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setUsuarios([]);
      } finally {
        setIsLoading(false);
      }
    };
    carregarUsuarios();
  }, []);

  const registrarUsuario = async (dadosUsuario: {
    nome: string;
    email: string;
    senha: string;
    role: string;
  }) => {
    try {
      const resultado = await criarUsuario({
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        senha: dadosUsuario.senha,
        papel: dadosUsuario.role,
      });
      if (resultado) {
        const novosUsuarios = await listarUsuarios();
        setUsuarios(novosUsuarios as Usuario[]);
      }
      return resultado;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return null;
    }
  };

  const editarUsuario = async (id: number, dados: { nome: string; role: string }) => {
    try {
      const { error } = await supabase
        .from('perfis_usuarios')
        .update({ nome: dados.nome, papel: dados.role })
        .eq('id', id);

      if (error) throw error;

      setUsuarios(prev => Array.isArray(prev) ? prev.map(u => 
        u.id === id ? { ...u, nome: dados.nome, role: dados.role as any } : u
      ) : []);
      return true;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      return false;
    }
  };

  const removerUsuario = async (id: number) => {
    try {
      const { error } = await supabase
        .from('perfis_usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsuarios(prev => Array.isArray(prev) ? prev.filter(u => u.id !== id) : []);
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return false;
    }
  };

  const alterarSenha = async (id: number, novaSenha: string) => {
    try {
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }
  };

  return {
    usuarios,
    usuarioAtual,
    isLoading,
    registrarUsuario,
    editarUsuario,
    removerUsuario,
    alterarSenha
  };
};

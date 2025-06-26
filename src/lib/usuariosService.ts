// 📁 src/lib/usuariosService.ts
import { supabase } from '@/lib/supabase-browser';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, role');

  if (error) {
    console.error('Erro ao buscar usuários:', error.message);
    return [];
  }

  return data || [];
};

export const adicionarUsuario = async (usuario: Omit<Usuario, 'id'>) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert(usuario)
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar usuário:', error.message);
    return null;
  }

  return data;
};

export const atualizarUsuario = async (id: string, updates: Partial<Usuario>) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    return null;
  }

  return data;
};

export const excluirUsuario = async (id: string) => {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir usuário:', error.message);
    return false;
  }

  return true;
};


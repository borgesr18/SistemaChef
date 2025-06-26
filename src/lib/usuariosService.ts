// 📁 src/lib/usuariosService.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

export const listarUsuarios = async () => {
  const { data, error } = await supabase
    .from('perfis_usuarios')
    .select('id, nome, email, papel');

  if (error) {
    console.error('Erro ao listar usuários:', error.message);
    return [];
  }

  return data;
};

export const buscarUsuarioPorId = async (id: string) => {
  const { data, error } = await supabase
    .from('perfis_usuarios')
    .select('id, nome, email, papel')
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

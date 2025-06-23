import { getAuthHeaders } from './apiClient';

export const registrarUsuario = async (dadosUsuario: {
  nome: string;
  email: string;
  senha: string;
  role?: string;
}): Promise<{ success: boolean; message: string; usuario?: any }> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dadosUsuario)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Erro ao registrar usuário'
      };
    }

    return {
      success: true,
      message: 'Usuário registrado com sucesso',
      usuario: data
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return {
      success: false,
      message: 'Erro interno do servidor'
    };
  }
};

'use client';

import { useState, useEffect } from 'react';
import { createHash } from 'crypto';

const adminEmail = 'rba1807@gmail.com';
const adminNome = 'Admin';

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  oculto?: boolean;
}

const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const hashSenha = (senha: string) => {
  return createHash('sha256').update(senha).digest('hex');
};

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const obterUsuarios = async (): Promise<UsuarioInfo[]> => {
  try {
    const response = await fetch('/api/auth/users', {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    
    const lista = await response.json();
    return lista.map((u: any) => ({ role: 'viewer', ...u }));
  } catch (err) {
    console.error('Erro ao buscar usuários da API:', err);
    return [];
  }
};

const filtrarOculto = (lista: UsuarioInfo[]) =>
  lista.filter(u => !(u.email === adminEmail && u.nome === adminNome));

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    
    const carregarUsuarios = async () => {
      try {
        const armazenados = await obterUsuarios();
        setUsuarios(filtrarOculto(armazenados));
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };
    
    const carregarUsuarioAtual = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        if (token && userData && userData !== 'undefined') {
          setUsuarioAtual(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário atual:', error);
      }
    };
    
    carregarUsuarios();
    carregarUsuarioAtual();
    setIsInitialized(true);
  }, [isInitialized]);

  const senhaForte = (senha: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(senha);

  const registrarUsuario = async (dados: {
    nome: string;
    email: string;
    senha: string;
    role?: 'admin' | 'editor' | 'viewer' | 'manager';
  }) => {
    if (usuarios.some(u => u.email === dados.email)) return null;
    if (!senhaForte(dados.senha)) return null;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dados),
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        console.error('Erro no registro:', responseData);
        return null;
      }

      const novo = responseData as UsuarioInfo;
      const novos = [...usuarios, novo];
      setUsuarios(novos);
      return novo;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return null;
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (!res.ok) return null;

      const { user, token } = await res.json();
      setUsuarioAtual(user);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      const armazenados = await obterUsuarios();
      if (!armazenados.find(u => u.id === user.id)) {
        const total = [...armazenados, user];
        setUsuarios(filtrarOculto(total));
      }

      return user;
    } catch {
      return null;
    }
  };

  const logout = () => {
    setUsuarioAtual(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const removerUsuario = async (id: string) => {
    try {
      const response = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário');
      }

      const total = await obterUsuarios();
      setUsuarios(filtrarOculto(total));
      
      if (usuarioAtual?.id === id) {
        logout();
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return false;
    }
  };

  const alterarSenha = async (id: string, novaSenha: string) => {
    try {
      const response = await fetch(`/api/auth/users/${id}/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ novaSenha })
      });

      if (!response.ok) {
        throw new Error('Erro ao alterar senha');
      }

      const total = await obterUsuarios();
      setUsuarios(filtrarOculto(total));
      
      if (usuarioAtual?.id === id) {
        const atualizado = total.find(u => u.id === id) || null;
        setUsuarioAtual(atualizado);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }
  };

  const editarUsuario = async (
    id: string,
    dados: { nome: string; email: string; role: 'admin' | 'editor' | 'viewer' | 'manager' }
  ) => {
    try {
      const usuarios = await obterUsuarios();
      if (usuarios.some(u => u.email === dados.email && u.id !== id)) return false;

      const response = await fetch(`/api/auth/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error('Erro ao editar usuário');
      }

      const total = await obterUsuarios();
      setUsuarios(filtrarOculto(total));
      
      if (usuarioAtual?.id === id) {
        const atualizado = total.find(u => u.id === id) || null;
        setUsuarioAtual(atualizado);
        localStorage.setItem('user_data', JSON.stringify(atualizado));
      }

      return true;
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      return false;
    }
  };

  return {
    usuarios,
    usuarioAtual,
    registrarUsuario,
    login,
    logout,
    removerUsuario,
    alterarSenha,
    editarUsuario,
  };
};

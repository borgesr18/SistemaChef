'use client';

import { useState, useEffect } from 'react';




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
    console.log('📡 Fazendo chamada para /api/auth/users...');
    const response = await fetch('/api/auth/users', {
      headers: getAuthHeaders()
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro na API users: ${response.status} - ${errorText}`);
      throw new Error(`Erro ao buscar usuários: ${response.status}`);
    }
    
    const lista = await response.json();
    console.log(`✅ Usuários da API: ${lista.length}`);
    return lista.map((u: any) => ({ role: 'viewer', ...u }));
  } catch (err) {
    console.error('❌ Erro ao buscar usuários da API:', err);
    return [];
  }
};

const filtrarOculto = (lista: UsuarioInfo[]) =>
  lista.filter(u => !u.oculto);

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>([]);
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Carregando usuários...');
        
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        console.log('🔐 Auth state:', { 
          tokenExists: !!token,
          userDataExists: !!userData
        });
        
        if (token && userData && userData !== 'undefined') {
          const user = JSON.parse(userData);
          console.log('✅ Usuário atual carregado:', user.email);
          setUsuarioAtual(user);
          
          if (user.role === 'admin') {
            const armazenados = await obterUsuarios();
            console.log('✅ Usuários carregados:', armazenados?.length || 0);
            setUsuarios(armazenados);
          } else {
            console.log('👤 User is not admin, skipping users list');
            setUsuarios([]);
          }
        } else {
          console.log('⚠️ No valid auth token or user data found');
          setUsuarioAtual(null);
          setUsuarios([]);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        setUsuarios([]);
        setUsuarioAtual(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarUsuarios();
  }, []);

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
    isLoading,
    registrarUsuario,
    login,
    logout,
    removerUsuario,
    alterarSenha,
    editarUsuario,
  };
};

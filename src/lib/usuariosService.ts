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

const salvarUsuarios = (usuarios: UsuarioInfo[]) => {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
};

const obterUsuarios = (): UsuarioInfo[] => {
  if (typeof window === 'undefined') return [];
  try {
    const usuariosString = localStorage.getItem('usuarios');
    const lista = usuariosString ? JSON.parse(usuariosString) : [];
    return lista.map((u: any) => ({ role: 'viewer', ...u }));
  } catch (err) {
    console.error('Erro ao ler usuários do localStorage', err);
    return [];
  }
};

const filtrarOculto = (lista: UsuarioInfo[]) =>
  lista.filter(u => !(u.email === adminEmail && u.nome === adminNome));

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>(() =>
    filtrarOculto(obterUsuarios())
  );
  const [usuarioAtual, setUsuarioAtual] = useState<UsuarioInfo | null>(() => {
    if (typeof window === 'undefined') return null;
    const armazenados = obterUsuarios();
    const idLogado = localStorage.getItem('usuarioLogado');
    return idLogado ? armazenados.find(u => u.id === idLogado) || null : null;
  });

  useEffect(() => {
    const armazenados = obterUsuarios();
    setUsuarios(filtrarOculto(armazenados));
    const idLogado = localStorage.getItem('usuarioLogado');
    if (idLogado) {
      const encontrado = armazenados.find(u => u.id === idLogado) || null;
      setUsuarioAtual(encontrado);
    }
  }, []);

  const senhaForte = (senha: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) return null;

      const novo = (await res.json()) as UsuarioInfo;
      const novos = [...usuarios, novo];
      setUsuarios(novos);
      salvarUsuarios(novos);
      return novo;
    } catch {
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

      const usuario = (await res.json()) as UsuarioInfo;
      setUsuarioAtual(usuario);
      localStorage.setItem('usuarioLogado', usuario.id);

      const armazenados = obterUsuarios();
      if (!armazenados.find(u => u.id === usuario.id)) {
        const novo: UsuarioInfo = {
          ...usuario,
          senhaHash: '',
          oculto: usuario.email === adminEmail && usuario.nome === adminNome,
        };
        const total = [...armazenados, novo];
        salvarUsuarios(total);
        setUsuarios(filtrarOculto(total));
      }

      return usuario;
    } catch {
      return null;
    }
  };

  const logout = () => {
    setUsuarioAtual(null);
    localStorage.removeItem('usuarioLogado');
  };

  const removerUsuario = (id: string) => {
    const total = obterUsuarios().filter(u => u.id !== id);
    salvarUsuarios(total);
    setUsuarios(filtrarOculto(total));
    const idLogado = localStorage.getItem('usuarioLogado');
    if (idLogado === id) {
      logout();
    }
  };

  const alterarSenha = (id: string, novaSenha: string) => {
    const total = obterUsuarios().map(u =>
      u.id === id ? { ...u, senhaHash: hashSenha(novaSenha) } : u
    );
    salvarUsuarios(total);
    setUsuarios(filtrarOculto(total));
    if (usuarioAtual?.id === id) {
      const atualizado = total.find(u => u.id === id) || null;
      setUsuarioAtual(atualizado);
    }
  };

  const editarUsuario = (
    id: string,
    dados: { nome: string; email: string; role: 'admin' | 'editor' | 'viewer' | 'manager' }
  ) => {
    if (obterUsuarios().some(u => u.email === dados.email && u.id !== id)) return false;

    const total = obterUsuarios().map(u =>
      u.id === id ? { ...u, nome: dados.nome, email: dados.email, role: dados.role } : u
    );
    salvarUsuarios(total);
    setUsuarios(filtrarOculto(total));
    if (usuarioAtual?.id === id) {
      const atualizado = total.find(u => u.id === id) || null;
      setUsuarioAtual(atualizado);
    }

    return true;
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

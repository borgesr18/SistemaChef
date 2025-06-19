import { createHash } from 'crypto';

export interface UsuarioInfo {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: 'admin' | 'editor' | 'viewer' | 'manager';
  oculto?: boolean;
}

const adminEmail = 'rba1807@gmail.com';
const adminNome = 'Admin';
const adminSenha = 'Rb180780@';

let usuarios: UsuarioInfo[] = [];

/** Gera hash da senha */
export const hashSenha = (senha: string) =>
  createHash('sha256').update(senha).digest('hex');

/** Garante que o Admin fixo sempre exista */
export const ensureAdmin = () => {
  const jaExiste = usuarios.some(u => u.email === adminEmail);
  if (!jaExiste) {
    usuarios.push({
      id: 'admin',
      nome: adminNome,
      email: adminEmail,
      senhaHash: hashSenha(adminSenha),
      role: 'admin',
      oculto: true,
    });
  }
};

/** Retorna todos os usuários visíveis (excluindo ocultos como admin fixo) */
export const getUsuarios = () => {
  ensureAdmin();
  return usuarios.filter(u => !u.oculto);
};

/** Retorna todos os usuários incluindo ocultos */
export const getAllUsuarios = () => {
  ensureAdmin();
  return usuarios;
};

/** Adiciona um novo usuário */
export const addUsuario = (dados: Omit<UsuarioInfo, 'id'>) => {
  const novo: UsuarioInfo = {
    ...dados,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
  };
  usuarios.push(novo);
  return novo;
};

/** Busca usuário por e-mail */
export const findByEmail = (email: string) => {
  ensureAdmin();
  return usuarios.find(u => u.email === email);
};

/** Validação de senha forte */
export const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);

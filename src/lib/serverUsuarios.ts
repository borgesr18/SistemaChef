import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

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

/** Gera hash da senha */
export const hashSenha = (senha: string) =>
  bcrypt.hashSync(senha, 10);

/** Verifica senha */
export const verificarSenha = (senha: string, hash: string) =>
  bcrypt.compareSync(senha, hash);

/** Garante que o Admin fixo sempre exista */
export const ensureAdmin = async () => {
  const adminExiste = await prisma.usuario.findUnique({
    where: { email: adminEmail }
  });

  if (!adminExiste) {
    await prisma.usuario.create({
      data: {
        id: 'admin',
        nome: adminNome,
        email: adminEmail,
        senhaHash: hashSenha(adminSenha),
        role: 'admin',
        oculto: true,
      }
    });
  }
};

/** Retorna todos os usuários visíveis (excluindo ocultos como admin fixo) */
export const getUsuarios = async () => {
  await ensureAdmin();
  return await prisma.usuario.findMany({
    where: { oculto: false }
  });
};

/** Retorna todos os usuários incluindo ocultos */
export const getAllUsuarios = async () => {
  await ensureAdmin();
  return await prisma.usuario.findMany();
};

/** Adiciona um novo usuário */
export const addUsuario = async (dados: Omit<UsuarioInfo, 'id'>) => {
  return await prisma.usuario.create({
    data: dados
  });
};

/** Busca usuário por e-mail */
export const findByEmail = async (email: string) => {
  await ensureAdmin();
  return await prisma.usuario.findUnique({
    where: { email }
  });
};

/** Validação de senha forte */
export const senhaForte = (senha: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(senha);

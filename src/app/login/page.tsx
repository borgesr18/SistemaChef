'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUsuarios } from '@/lib/usuariosService';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { login, usuarioAtual } = useUsuarios();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (usuarioAtual) {
      router.replace('/');
    }
  }, [usuarioAtual, router]);

  if (usuarioAtual) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const usuario = await login(email, senha);
    if (usuario) {
      router.push('/');
    } else {
      setErro('Credenciais inválidas');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96">
        <div className="flex justify-center mb-4">
          <Logo className="text-2xl" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Entrar</h1>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" fullWidth>
            Entrar
          </Button>

          <p className="text-sm text-center">
            Não possui conta?{' '}
            <Link href="/usuarios/novo" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

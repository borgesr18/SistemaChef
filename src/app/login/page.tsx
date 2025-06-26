// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro('Email ou senha inválidos.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {erro && (
          <p className="text-red-500 text-center text-sm">{erro}</p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium mb-1">
            Senha
          </label>
          <Input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
}


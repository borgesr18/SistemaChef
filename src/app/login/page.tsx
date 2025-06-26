'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

const supabase = supabaseBrowser();

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro('Email ou senha inválidos');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Entrar no Sistema</h1>

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
        />

        <label className="block mb-2 font-medium">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {erro && <p className="text-red-600 text-sm mt-4">{erro}</p>}
      </form>
    </div>
  );
}

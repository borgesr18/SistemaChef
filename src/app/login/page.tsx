// 📁 src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    setErro('');
    setCarregando(true);
    const resultado = await login(email, senha);

    if (resultado.sucesso) {
      router.push('/');
    } else {
      setErro(resultado.mensagem);
    }

    setCarregando(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Entrar no Sistema</h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <Button onClick={handleLogin} disabled={carregando} className="w-full">
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>
      </div>
    </div>
  );
}


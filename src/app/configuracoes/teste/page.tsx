'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

export default function VerificaSessao() {
  const [info, setInfo] = useState<string>('Verificando...');

  useEffect(() => {
    const testarSessao = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro:', error);
        setInfo('❌ Sessão inválida ou ausente');
      } else {
        console.log('✅ Usuário:', data?.user);
        setInfo(`✅ Sessão ativa para: ${data?.user?.email}`);
      }
    };

    testarSessao();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Teste de Sessão Supabase</h2>
      <p>{info}</p>
    </div>
  );
}


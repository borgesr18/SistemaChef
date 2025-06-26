'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

export default function TesteDiagnosticoPermissoes() {
  const [status, setStatus] = useState<string>('Carregando...');
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    const testarPermissoes = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        setStatus('❌ Sessão não encontrada ou usuário não autenticado');
        return;
      }

      const { data, error } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .limit(1);

      if (error) {
        setStatus(`❌ Erro ao buscar perfil: ${error.message}`);
      } else {
        setPerfil(data[0]);
        setStatus('✅ Permissões OK! Perfil carregado com sucesso.');
      }
    };

    testarPermissoes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico de Permissões</h1>
      <p className="mb-4">{status}</p>
      {perfil && (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(perfil, null, 2)}
        </pre>
      )}
    </div>
  );
}

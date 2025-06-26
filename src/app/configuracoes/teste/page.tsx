import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sutmfzcmrlqnocsusiav.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const DiagnosticoPermissoes = () => {
  useEffect(() => {
    const testarPermissoes = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error('❌ Sessão inválida ou não encontrada:', sessionError);
        return;
      }

      console.log('✅ Sessão ativa:', sessionData.session.user);

      const { data: perfil, error: erroPerfil } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (erroPerfil) {
        console.error('❌ Falha ao acessar perfil individual:', erroPerfil);
      } else {
        console.log('✅ Perfil acessado com sucesso:', perfil);
      }

      const { data: todosPerfis, error: erroTodos } = await supabase
        .from('perfis_usuarios')
        .select('*')
        .order('nome');

      if (erroTodos) {
        console.error('❌ Falha ao acessar todos os perfis:', erroTodos);
      } else {
        console.log('✅ Lista de perfis acessada com sucesso:', todosPerfis);
      }
    };

    testarPermissoes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Diagnóstico de Permissões</h1>
      <p>Verifique o console do navegador para os resultados dos testes.</p>
    </div>
  );
};

export default DiagnosticoPermissoes;

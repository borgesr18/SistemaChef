// /src/app/configuracoes/page.tsx
import { supabaseServer } from '@/lib/supabase-server';
import ConfiguracoesLayout from '@/components/configuracoes/ConfiguracoesLayout'; // supondo que este componente exista

export default async function Page() {
  const supabase = supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-600">Erro ao carregar usuário</h1>
        <p className="text-gray-700">{error.message}</p>
      </div>
    );
  }

  return <ConfiguracoesLayout user={user} />;
}

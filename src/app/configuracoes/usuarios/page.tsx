import { supabaseServer } from '@/lib/supabase-server';

export default async function UsuariosPage() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('usuarios').select('*').order('nome', { ascending: true });

  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {data.map((usuario) => (
          <li key={usuario.id}>{usuario.nome} - {usuario.role}</li>
        ))}
      </ul>
    </div>
  );
}

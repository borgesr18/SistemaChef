// Este é um SERVER COMPONENT – não deve ter 'use client'

import { supabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function UsuariosPage() {
  const supabase = supabaseServer()

  // Verifica se o usuário está logado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Busca todos os perfis de usuários
  const { data: usuarios, error } = await supabase
    .from('perfis_usuarios')
    .select('*')
    .order('nome', { ascending: true })

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-600">Erro ao carregar usuários</h1>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Lista de Usuários</h1>
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Função (Role)</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.map((usuario) => (
            <tr key={usuario.id}>
              <td className="p-2 border">{usuario.nome}</td>
              <td className="p-2 border">{usuario.email}</td>
              <td className="p-2 border">{usuario.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

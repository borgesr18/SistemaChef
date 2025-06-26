// lib/fetchProdutos.ts
import { supabaseBrowser } from '@/lib/supabase-browser';

export async function fetchProdutos() {
  const supabase = supabaseBrowser();
  const { data: sessionData, error } = await supabase.auth.getSession();

  const token = sessionData?.session?.access_token;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch('/api/produtos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }

  return await response.json();
}

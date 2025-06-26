// lib/fetchProdutos.ts
// ✅ Exemplo de fetchProdutos.ts corrigido
'use client';

import { supabaseBrowser } from '@/lib/supabase-browser';

export async function fetchProdutos() {
  const supabase = supabaseBrowser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch('/api/produtos', {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return await res.json();
}

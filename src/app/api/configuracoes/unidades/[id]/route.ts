// 📁 src/app/api/configuracoes/unidades/[id]/route.ts
// ❌ Remover qualquer linha como:
// import { useEffect } from 'react';
// useEffect(() => {...}, []);
// ✅ Apenas lógica de handler API aqui

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabase.from('unidades').update(body).eq('id', params.id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
}


'use client';

import { supabaseBrowser } from '@/lib/supabase-browser';

const supabase = supabaseBrowser();

export async function listarCategoriasInsumos() {
  const { data, error } = await supabase
    .from('categorias_insumos')
    .select('*')
    .order('nome', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function adicionarCategoria(nome: string) {
  const { error } = await supabase
    .from('categorias_insumos')
    .insert({ nome });

  if (error) throw new Error(error.message);
}

export async function atualizarCategoria(id: string, nome: string) {
  const { error } = await supabase
    .from('categorias_insumos')
    .update({ nome })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function excluirCategoria(id: string) {
  const { error } = await supabase
    .from('categorias_insumos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

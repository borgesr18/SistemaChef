// src/lib/categoriasInsumosService.ts
import { supabase } from '@/lib/supabase-browser';

export async function fetchCategorias() {
  const { data, error } = await supabase.from('categorias_insumos').select('*');
  if (error) throw error;
  return data;
}

export async function adicionarCategoria(nome: string) {
  const { data, error } = await supabase.from('categorias_insumos').insert([{ nome }]).select().single();
  if (error) throw error;
  return data;
}

export async function atualizarCategoria(id: string, nome: string) {
  const { data, error } = await supabase.from('categorias_insumos').update({ nome }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function excluirCategoria(id: string) {
  const { error } = await supabase.from('categorias_insumos').delete().eq('id', id);
  if (error) throw error;
}


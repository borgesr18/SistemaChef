// 📁 src/lib/categoriasInsumosService.ts
import { supabase } from '@/lib/supabase-browser';

export async function fetchCategorias() {
  const { data, error } = await supabase.from('categorias_insumos').select('*');
  if (error) throw error;
  return data;
}

export async function adicionarCategoria(categoria: { nome: string }) {
  const { data, error } = await supabase.from('categorias_insumos').insert([categoria]);
  if (error) throw error;
  return data;
}

export async function atualizarCategoria(id: number, categoria: { nome: string }) {
  const { data, error } = await supabase.from('categorias_insumos').update(categoria).eq('id', id);
  if (error) throw error;
  return data;
}

export async function excluirCategoria(id: number) {
  const { data, error } = await supabase.from('categorias_insumos').delete().eq('id', id);
  if (error) throw error;
  return data;
}


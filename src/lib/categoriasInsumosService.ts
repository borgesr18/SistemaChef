// src/lib/categoriasInsumosService.ts
'use client';

import { supabaseBrowser } from './supabase-browser';

const supabase = supabaseBrowser();

export async function listarCategoriasInsumos() {
  const { data, error } = await supabase
    .from('categorias_insumos')
    .select('*')
    .order('nome', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function criarCategoriaInsumo(nome: string) {
  const { data, error } = await supabase
    .from('categorias_insumos')
    .insert([{ nome }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function atualizarCategoriaInsumo(id: string, nome: string) {
  const { data, error } = await supabase
    .from('categorias_insumos')
    .update({ nome })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function excluirCategoriaInsumo(id: string) {
  const { error } = await supabase
    .from('categorias_insumos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

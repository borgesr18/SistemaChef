// src/lib/categoriasReceitasService.ts
import { supabase } from '@/lib/supabase-browser';

/**
 * Busca todas as categorias de receitas.
 */
export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('categorias_receitas')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar categorias:', error.message);
    throw new Error('Erro ao buscar categorias');
  }

  return data;
}

/**
 * Adiciona uma nova categoria de receita.
 * @param nome Nome da nova categoria
 */
export async function adicionarCategoria(nome: string) {
  const { data, error } = await supabase
    .from('categorias_receitas')
    .insert([{ nome }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar categoria:', error.message);
    throw new Error('Erro ao adicionar categoria');
  }

  return data;
}

/**
 * Atualiza o nome de uma categoria de receita.
 * @param id ID da categoria
 * @param nome Novo nome
 */
export async function atualizarCategoria(id: string, nome: string) {
  const { data, error } = await supabase
    .from('categorias_receitas')
    .update({ nome })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar categoria:', error.message);
    throw new Error('Erro ao atualizar categoria');
  }

  return data;
}

/**
 * Exclui uma categoria de receita.
 * @param id ID da categoria
 */
export async function excluirCategoria(id: string) {
  const { error } = await supabase
    .from('categorias_receitas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir categoria:', error.message);
    throw new Error('Erro ao excluir categoria');
  }
}

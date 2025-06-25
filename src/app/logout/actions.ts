'use server';

import { supabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function logout() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  redirect('/login');
}

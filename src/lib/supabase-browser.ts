// src/lib/supabase-browser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// Previne múltiplas instâncias em dev
let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function supabaseBrowser() {
  if (!client) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Variáveis de ambiente do Supabase não definidas!');
    }

    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  return client;
}


// 📁 src/lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export function supabase() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

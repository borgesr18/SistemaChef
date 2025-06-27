// 📁 src/lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr';

let client: any = null;

export const supabaseBrowser = () => {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
};

export const supabase = supabaseBrowser();


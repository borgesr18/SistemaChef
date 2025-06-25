// /src/app/layout.tsx
import './globals.css';
import { supabaseServer } from '@/lib/supabase-server';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="pt-br">
      <body>
        {/* Opcional: passar "user" por contexto */}
        {children}
      </body>
    </html>
  );
}
i

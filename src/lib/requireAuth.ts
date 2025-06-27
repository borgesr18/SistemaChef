// lib/requireAuth.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function requireAuth(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    throw new Error('Authentication required');
  }

  const user = session.user;
  if (!user.id) {
    throw new Error('Invalid user session');
  }

  return user;
}

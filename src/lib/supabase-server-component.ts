// src/lib/supabase-server-component.ts
'use server'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/lib/database.types'

export const createSupabaseServerClient = () => {
  return createServerComponentClient<Database>({
    cookies
  })
}

// src/lib/supabase-server.ts
import {
  createServerComponentClient,
  createRouteHandlerClient
} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const supabaseServer = () =>
  createServerComponentClient<Database>({ cookies: () => cookies() })

export const createClient = () =>
  createRouteHandlerClient<Database>({ cookies })

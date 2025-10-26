import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types'

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    profile = data
  }

  return {
    supabase,
    user,
    profile,
    req: opts?.req,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

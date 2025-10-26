import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setUserPresence, removeUserPresence, getPresence } from '@/lib/redis/presence'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { conversationId, action } = await req.json()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (action === 'join') {
    await setUserPresence(conversationId, profile.id)
  } else if (action === 'leave') {
    await removeUserPresence(conversationId, profile.id)
  }

  const activeUsers = await getPresence(conversationId)

  return NextResponse.json({ activeUsers })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversationId = req.nextUrl.searchParams.get('conversationId')

  if (!conversationId) {
    return NextResponse.json(
      { error: 'conversationId required' },
      { status: 400 }
    )
  }

  const activeUsers = await getPresence(conversationId)

  return NextResponse.json({ activeUsers })
}

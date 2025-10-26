import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { fileName, fileType, bucket = 'attachments' } = await req.json()

  if (!fileName || !fileType) {
    return NextResponse.json(
      { error: 'fileName and fileType required' },
      { status: 400 }
    )
  }

  // Generate a unique file path
  const filePath = `${user.id}/${Date.now()}-${fileName}`

  // Create a signed upload URL
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(filePath)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get the public URL for the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    filePath,
    publicUrl: publicUrlData.publicUrl,
  })
}

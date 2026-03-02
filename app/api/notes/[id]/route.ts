import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get file_path first to delete from storage
    const { data: note } = await supabase.from('notes').select('file_path').eq('id', id).single()

    if (note?.file_path) {
      await supabase.storage.from('pdfs').remove([note.file_path])
    }

    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ message: 'deleted' }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { title } = await request.json()
    if (!title) return NextResponse.json({ message: 'title required' }, { status: 400 })
    const { error } = await supabase.from('notes').update({ title }).eq('id', id)
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ message: 'updated' }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}

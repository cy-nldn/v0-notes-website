import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('name')
      .order('name', { ascending: true })
    if (error) return NextResponse.json({ topics: [] }, { status: 200 })
    return NextResponse.json({ topics: data || [] }, { status: 200 })
  } catch {
    return NextResponse.json({ topics: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    if (!name) return NextResponse.json({ message: 'name required' }, { status: 400 })
    const { error } = await supabase.from('topics').insert({ name: name.trim().toLowerCase() })
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ message: 'created' }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name } = await request.json()
    if (!name) return NextResponse.json({ message: 'name required' }, { status: 400 })
    const { error } = await supabase.from('topics').delete().eq('name', name)
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ message: 'deleted' }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'server error' }, { status: 500 })
  }
}

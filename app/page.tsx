import { createClient } from '@supabase/supabase-js'
import type { Note } from '@/lib/supabase'
import { SearchBox } from '@/components/SearchBox'
import { NotesGrid } from '@/components/NotesGrid'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getNotes(): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export default async function Home() {
  const notes = await getNotes()

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-full px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">notes</h1>
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <span>{notes.length} entries</span>
            <Link href="/upload" className="text-foreground hover:text-secondary transition-colors underline">
              upload
            </Link>
          </div>
        </div>
        
        <SearchBox />

        {/* Description */}
        <p className="text-muted-foreground text-sm mt-6 mb-8 max-w-2xl leading-relaxed">
          Math lecture notes, definitions, and solutions. Community-driven. Upload your own notes above.
        </p>

        {/* Sections Navigation */}
        <div className="mb-8">
          <p className="text-muted-foreground text-xs mb-3">sections</p>
          <div className="flex gap-6">
            <button className="text-foreground hover:text-secondary transition-colors">Year 1</button>
            <button className="text-foreground hover:text-secondary transition-colors">Year 2</button>
            <button className="text-foreground hover:text-secondary transition-colors">Year 3</button>
          </div>
        </div>

        {/* Notes Grid */}
        <NotesGrid notes={notes} />
      </div>
    </main>
  )
}

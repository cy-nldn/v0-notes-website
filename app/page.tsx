'use client'

import { NotesList } from '@/components/NotesList'
import { Terminal } from '@/components/Terminal'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Note } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotes()
  }, [])

  async function getNotes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
        setNotes([])
      } else {
        setNotes(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Terminal title="math_notes">
          <div className="space-y-4">
            <div className="text-foreground">
              <p className="text-lg font-bold">$ welcome to math notes</p>
              <p className="text-muted-foreground text-sm mt-2">
                share and discover handwritten math notes. simple. minimal. yours.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                href="/upload"
                className="bg-foreground text-background px-6 py-2 font-bold hover:bg-secondary hover:text-background transition-colors inline-block"
              >
                $ upload notes
              </Link>
              <button
                onClick={() => getNotes()}
                className="bg-background border-2 border-foreground text-foreground px-6 py-2 font-bold hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '$ loading...' : '$ refresh'}
              </button>
            </div>
          </div>
        </Terminal>

        {/* Notes List */}
        <NotesList notes={notes} />

        {/* Footer */}
        <Terminal>
          <p className="text-muted-foreground text-xs">
            $ math notes © 2024 | built with next.js, supabase & terminal energy
          </p>
        </Terminal>
      </div>
    </main>
  )
}

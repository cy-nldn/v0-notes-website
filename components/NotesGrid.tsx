'use client'

import Link from 'next/link'
import { Note } from '@/lib/supabase'

interface NotesGridProps {
  notes: Note[]
}

export function NotesGrid({ notes }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        no notes yet. try uploading some!
      </div>
    )
  }

  // Group notes by subject
  const grouped: { [key: string]: Note[] } = {}
  notes.forEach(note => {
    const key = note.subject || 'uncategorized'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(note)
  })

  return (
    <div className="grid grid-cols-2 gap-x-12 gap-y-10">
      {Object.entries(grouped).map(([subject, subNotes]) => (
        <div key={subject}>
          <h2 className="text-foreground font-bold text-sm mb-1">{subject}</h2>
          <p className="text-muted-foreground text-xs mb-3">
            {subNotes.length} {subNotes.length === 1 ? 'note' : 'notes'}
          </p>
          <div className="space-y-2">
            {subNotes.map((note) => (
              <div key={note.id} className="flex items-center justify-between border-b border-muted py-2 hover:border-foreground transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href={`/notes/${note.id}`} className="text-foreground hover:text-secondary text-sm transition-colors truncate block">
                    {note.title}
                  </Link>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {new Date(note.created_at).getFullYear()}
                  </p>
                </div>
                <div className="flex gap-2 ml-2 shrink-0">
                  <span className="border border-primary text-primary px-2 py-0.5 text-xs">PDF</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

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
        No notes found. Try uploading some!
      </div>
    )
  }

  // Group notes by subject
  const groupedByYear: { [key: string]: Note[] } = {}
  
  notes.forEach(note => {
    const year = note.subject || 'Uncategorized'
    if (!groupedByYear[year]) {
      groupedByYear[year] = []
    }
    groupedByYear[year].push(note)
  })

  return (
    <div className="space-y-12">
      {Object.entries(groupedByYear).map(([year, yearNotes]) => (
        <div key={year}>
          {/* Year header */}
          <h2 className="text-foreground font-bold text-lg mb-2">{year}</h2>
          <p className="text-muted-foreground text-sm mb-6">
            {yearNotes.length} {yearNotes.length === 1 ? 'note' : 'notes'}
          </p>

          {/* Course list */}
          <div className="space-y-4">
            {yearNotes.map((note) => (
              <div key={note.id} className="flex items-center justify-between border-b border-muted py-3 hover:border-foreground transition-colors">
                <div className="flex-1">
                  <Link href={`/notes/${note.id}`} className="text-foreground hover:text-secondary font-bold transition-colors">
                    {note.title}
                  </Link>
                  <p className="text-muted-foreground text-xs mt-1">
                    {new Date(note.created_at).getFullYear()}
                  </p>
                </div>

                {/* Download buttons */}
                <div className="flex gap-2">
                  <button className="border border-primary text-primary px-3 py-1 text-xs hover:border-foreground hover:text-foreground transition-colors">
                    PDF
                  </button>
                  {note.description && (
                    <button className="border border-secondary text-secondary px-3 py-1 text-xs hover:border-foreground hover:text-foreground transition-colors">
                      {note.description}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

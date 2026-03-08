'use client'

import Link from 'next/link'
import { Note } from '@/lib/supabase'

export function NotesGrid({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className="desc-text">no notes yet. try uploading some!</p>
  }

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
          <h2 className="note-group-title mb-1">{subject}</h2>
          <p className="note-group-count mb-3">
            {subNotes.length} {subNotes.length === 1 ? 'note' : 'notes'}
          </p>
          <div className="space-y-2">
            {subNotes.map((note) => (
              <div key={note.id} className="flex items-center justify-between py-2 border-b note-divider">
                <div className="flex-1 min-w-0">
                  <Link href={`/notes/${note.id}`} className="note-link">{note.title}</Link>
                  <p className="note-year mt-0.5">{new Date(note.created_at).getFullYear()}</p>
                </div>
                <span className="note-badge ml-3 shrink-0">PDF</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

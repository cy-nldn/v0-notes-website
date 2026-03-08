'use client'

import Link from 'next/link'
import { Note } from '@/lib/supabase'

export function NotesGrid({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className="text-sm" style={{color:'#4a6b67'}}>no notes yet. try uploading some!</p>
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
          <h2 className="text-sm font-semibold mb-1" style={{color:'#5ecfbf'}}>{subject}</h2>
          <p className="text-xs mb-3" style={{color:'#3a8f85'}}>
            {subNotes.length} {subNotes.length === 1 ? 'note' : 'notes'}
          </p>
          <div className="space-y-2">
            {subNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between py-2 border-b transition-colors"
                style={{borderColor:'#152220'}}
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/notes/${note.id}`}
                    className="text-sm transition-colors hover:underline"
                    style={{color:'#e8edec'}}
                    onMouseEnter={e => (e.currentTarget.style.color = '#5ecfbf')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#e8edec')}
                  >
                    {note.title}
                  </Link>
                  <p className="text-xs mt-0.5" style={{color:'#4a6b67'}}>
                    {new Date(note.created_at).getFullYear()}
                  </p>
                </div>
                <span className="text-xs ml-3 px-2 py-0.5 border shrink-0" style={{borderColor:'#3a8f85', color:'#3a8f85'}}>
                  PDF
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

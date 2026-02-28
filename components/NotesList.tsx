'use client'

import Link from 'next/link'
import { Note } from '@/lib/supabase'
import { Terminal } from './Terminal'

interface NotesListProps {
  notes: Note[]
}

export function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <Terminal title="notes">
        <p className="text-muted-foreground">$ no notes found. try uploading some?</p>
      </Terminal>
    )
  }

  return (
    <Terminal title="notes">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-foreground">
              <th className="text-left py-2 px-2 text-foreground font-bold">TITLE</th>
              <th className="text-left py-2 px-2 text-foreground font-bold">SUBJECT</th>
              <th className="text-left py-2 px-2 text-foreground font-bold">UPLOADED</th>
              <th className="text-left py-2 px-2 text-foreground font-bold">VIEWS</th>
              <th className="text-left py-2 px-2 text-foreground font-bold">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, idx) => (
              <tr
                key={note.id}
                className={`border-b border-muted ${idx % 2 === 0 ? 'bg-card' : 'bg-background'} hover:bg-foreground hover:text-background transition-colors`}
              >
                <td className="py-3 px-2 font-mono text-foreground truncate max-w-[200px]">
                  {note.title}
                </td>
                <td className="py-3 px-2 text-accent">{note.subject}</td>
                <td className="py-3 px-2 text-muted-foreground text-xs">
                  {new Date(note.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-2 text-secondary">{note.view_count}</td>
                <td className="py-3 px-2">
                  <Link
                    href={`/notes/${note.id}`}
                    className="text-foreground hover:text-secondary underline text-sm"
                  >
                    view →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Terminal>
  )
}

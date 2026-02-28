'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Terminal } from '@/components/Terminal'
import { createClient } from '@supabase/supabase-js'
import type { Note } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NotePage() {
  const params = useParams()
  const id = params.id as string
  const [note, setNote] = useState<Note | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // Get note metadata
        const { data, error: fetchError } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) {
          setError('$ error: note not found')
          return
        }

        setNote(data)

        // Get signed URL for PDF
        const { data: urlData } = supabase.storage
          .from('pdfs')
          .getPublicUrl(data.file_path)

        setPdfUrl(urlData.publicUrl)

        // Increment view count
        await supabase
          .from('notes')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id)
      } catch (err) {
        console.error('Error:', err)
        setError('$ error: failed to load note')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground p-6 font-mono">
        <div className="max-w-4xl mx-auto">
          <Terminal title="loading">
            <p className="text-muted-foreground">$ fetching note data...</p>
          </Terminal>
        </div>
      </main>
    )
  }

  if (error || !note || !pdfUrl) {
    return (
      <main className="min-h-screen bg-background text-foreground p-6 font-mono">
        <div className="max-w-4xl mx-auto space-y-6">
          <Terminal title="error">
            <p className="text-destructive mb-4">{error || '$ note not found'}</p>
            <Link
              href="/"
              className="text-foreground hover:text-secondary underline"
            >
              ← back to notes
            </Link>
          </Terminal>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Terminal title={note.title}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-xs">$ subject</p>
                <p className="text-accent font-bold">{note.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">$ views</p>
                <p className="text-secondary font-bold">{note.view_count}</p>
              </div>
            </div>
            {note.description && (
              <div>
                <p className="text-muted-foreground text-xs">$ description</p>
                <p className="text-foreground text-sm">{note.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6 pt-2 border-t-2 border-muted">
              <div>
                <p className="text-muted-foreground text-xs">$ uploaded by</p>
                <p className="text-foreground">{note.uploaded_by}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">$ date</p>
                <p className="text-foreground">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Terminal>

        {/* PDF Viewer */}
        <Terminal title="preview">
          <div className="bg-background p-4 border-2 border-muted">
            <iframe
              src={pdfUrl}
              className="w-full h-[600px]"
              title={note.title}
            />
          </div>
        </Terminal>

        {/* Actions */}
        <Terminal>
          <div className="flex gap-4 items-center justify-between">
            <Link
              href="/"
              className="bg-background border-2 border-foreground text-foreground px-6 py-2 font-bold hover:bg-foreground hover:text-background transition-colors inline-block"
            >
              ← back to notes
            </Link>
            <a
              href={pdfUrl}
              download={note.file_name}
              className="bg-foreground text-background px-6 py-2 font-bold hover:bg-secondary hover:text-background transition-colors inline-block"
            >
              $ download
            </a>
          </div>
        </Terminal>
      </div>
    </main>
  )
}

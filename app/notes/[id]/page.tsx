'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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
        const { data, error: fetchError } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) { setError('note not found'); return }

        setNote(data)

        const { data: urlData } = supabase.storage
          .from('pdfs')
          .getPublicUrl(data.file_path)

        setPdfUrl(urlData.publicUrl)

        await supabase
          .from('notes')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id)
      } catch {
        setError('failed to load note')
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground font-mono">
        <div className="glitch-wrap max-w-5xl mx-auto px-8 py-12">
          <p className="text-muted-foreground text-xs tracking-widest">fetching...</p>
        </div>
      </main>
    )
  }

  if (error || !note || !pdfUrl) {
    return (
      <main className="min-h-screen bg-background text-foreground font-mono">
        <div className="glitch-wrap max-w-5xl mx-auto px-8 py-12">
          <p className="text-destructive text-sm mb-4">{error || 'note not found'}</p>
          <Link href="/" className="text-muted-foreground text-xs hover:text-foreground transition-colors">← back</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="glitch-wrap glitch-layer-1 max-w-5xl mx-auto px-8 py-12">

        {/* Centred header */}
        <div className="text-center mb-2">
          <h1 className="glitch-text font-light tracking-[0.25em] text-base uppercase text-foreground">
            c h r i s &apos; s &nbsp; r a n d o m &nbsp; m a t h s &nbsp; n o t e s
          </h1>
          <p className="text-muted-foreground text-xs tracking-widest mt-1">
            {note.title}
          </p>
        </div>

        <div className="flex justify-center mb-10 mt-4">
          <Link
            href="/"
            className="border border-muted-foreground text-muted-foreground text-xs px-4 py-1 tracking-widest hover:border-foreground hover:text-foreground transition-colors uppercase"
          >
            / back
          </Link>
        </div>

        <hr className="border-border mb-8" />

        {/* Note metadata */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">topic</p>
            <p className="text-foreground">{note.subject}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">date</p>
            <p className="text-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
          </div>
          {note.description && (
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">description</p>
              <p className="text-foreground">{note.description}</p>
            </div>
          )}
        </div>

        <hr className="border-border mb-8" />

        {/* PDF viewer */}
        <div className="mb-8">
          <p className="text-muted-foreground text-xs tracking-widest uppercase mb-4">— preview —</p>
          <iframe
            src={pdfUrl}
            className="w-full border border-border"
            style={{ height: '700px' }}
            title={note.title}
          />
        </div>

        <hr className="border-border mb-6" />

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="border border-muted-foreground text-muted-foreground text-xs px-4 py-1 tracking-widest hover:border-foreground hover:text-foreground transition-colors uppercase"
          >
            / back to notes
          </Link>
          <a
            href={pdfUrl}
            download
            className="border border-muted-foreground text-muted-foreground text-xs px-4 py-1 tracking-widest hover:border-foreground hover:text-foreground transition-colors uppercase"
          >
            / download
          </a>
        </div>

      </div>
    </main>
  )
}

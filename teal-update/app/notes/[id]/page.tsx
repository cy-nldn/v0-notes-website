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
    async function fetchNote() {
      try {
        const { data, error: fetchError } = await supabase
          .from('notes').select('*').eq('id', id).single()
        if (fetchError) { setError('note not found'); return }
        setNote(data)
        const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(data.file_path)
        setPdfUrl(urlData.publicUrl)
        await supabase.from('notes').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id)
      } catch { setError('failed to load note') }
      finally { setLoading(false) }
    }
    fetchNote()
  }, [id])

  const navBtn = "border text-sm px-4 py-1 tracking-widest uppercase transition-colors"

  if (loading) return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="glitch-wrap max-w-5xl mx-auto px-8 py-12">
        <p className="text-sm" style={{color:'#3a8f85'}}>fetching...</p>
      </div>
    </main>
  )

  if (error || !note || !pdfUrl) return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="glitch-wrap max-w-5xl mx-auto px-8 py-12">
        <p className="text-sm mb-4" style={{color:'#ff5555'}}>{error || 'note not found'}</p>
        <Link href="/" className="text-sm" style={{color:'#3a8f85'}}>← back</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="glitch-wrap glitch-layer-1 max-w-5xl mx-auto px-8 py-12">

        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="glitch-text font-light tracking-[0.3em] text-lg uppercase text-foreground">
            c h r i s &apos; s &nbsp; r a n d o m &nbsp; m a t h s &nbsp; n o t e s
          </h1>
          <p className="text-sm tracking-widest mt-2" style={{color:'#5ecfbf'}}>{note.title}</p>
        </div>

        <div className="flex justify-center mb-10 mt-5">
          <Link href="/" className={navBtn} style={{borderColor:'#3a8f85', color:'#3a8f85'}}>
            / back
          </Link>
        </div>

        <hr className="mb-8" style={{borderColor:'#152220'}} />

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-5 mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{color:'#3a8f85'}}>topic</p>
            <p className="text-sm text-foreground">{note.subject}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{color:'#3a8f85'}}>date</p>
            <p className="text-sm text-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
          </div>
          {note.description && (
            <div className="col-span-2">
              <p className="text-xs tracking-widest uppercase mb-1" style={{color:'#3a8f85'}}>description</p>
              <p className="text-sm text-foreground">{note.description}</p>
            </div>
          )}
        </div>

        <hr className="mb-8" style={{borderColor:'#152220'}} />

        {/* PDF viewer */}
        <div className="mb-8">
          <p className="text-sm mb-4 tracking-widest uppercase" style={{color:'#3a8f85'}}>— preview —</p>
          <iframe
            src={pdfUrl}
            className="w-full border"
            style={{ height: '700px', borderColor: '#152220' }}
            title={note.title}
          />
        </div>

        <hr className="mb-6" style={{borderColor:'#152220'}} />

        <div className="flex justify-between items-center">
          <Link href="/" className={navBtn} style={{borderColor:'#3a8f85', color:'#3a8f85'}}>
            / back to notes
          </Link>
          <a href={pdfUrl} download className={navBtn} style={{borderColor:'#3a8f85', color:'#3a8f85'}}>
            / download
          </a>
        </div>

      </div>
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const FALLBACK_TOPICS = [
  'gamma/beta', 'cauchy-riemann eqs', 'dilog/digamma',
  'yukawa derivation (non-rigorous)', 'basic dynamics/dim analysis', 'some calc iii',
  'general forces', 'construction of natural numbers', 'functional eqs',
  'construction of multiplication', 'arithmetic function/mobius inverse', 'manifolds',
  'kepler problem', 'partial sums/divisor function', 'intro to galois',
  'some groups', 'basic graph theory', 'spectral theorem for hermitian matrices',
  'analytic number theory', 'rank 1/2 tensors', 'jones vectors/em polarisation',
  'symplectic LA', 'symplectic manifolds', 'symplectomorphisms/moser theorem',
  'relative moser and darboux', 'euler lagrange', 'polarisation/su(2)',
  'quasihomomorphisms', 'noetherian/artinian algebras', 'lagrangian manifolds',
]

interface Note {
  id: string
  title: string
  subject: string
  created_at: string
}

type Tab = 'upload' | 'manage'

export function UploadForm() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // topics state
  const [topics, setTopics] = useState<string[]>(FALLBACK_TOPICS)
  const [newTopic, setNewTopic] = useState('')
  const [topicsLoading, setTopicsLoading] = useState(false)

  // notes state
  const [notes, setNotes] = useState<Note[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [editingNote, setEditingNote] = useState<{ id: string; title: string } | null>(null)

  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    file: null as File | null,
  })

  // Load topics and notes from supabase
  useEffect(() => {
    loadTopics()
    loadNotes()
  }, [])

  async function loadTopics() {
    try {
      const res = await fetch('/api/topics')
      if (res.ok) {
        const data = await res.json()
        if (data.topics && data.topics.length > 0) {
          setTopics(data.topics.map((t: { name: string }) => t.name))
        }
      }
    } catch {}
  }

  async function loadNotes() {
    setNotesLoading(true)
    try {
      const res = await fetch('/api/notes')
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notes || [])
      }
    } catch {} finally {
      setNotesLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setError('only PDF files are allowed'); return }
    if (file.size > 50 * 1024 * 1024) { setError('file too large (max 50MB)'); return }
    setForm(prev => ({ ...prev, file }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.subject || !form.file) {
      setError('title, topic, and file are required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('subject', form.subject)
      formData.append('description', form.description)
      formData.append('uploaded_by', 'chris')
      formData.append('file', form.file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'upload failed')
      }
      setSuccess(true)
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Topic management
  async function addTopic() {
    const name = newTopic.trim().toLowerCase()
    if (!name || topics.includes(name)) return
    setTopicsLoading(true)
    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        setTopics(prev => [...prev, name].sort())
        setNewTopic('')
      }
    } catch {} finally {
      setTopicsLoading(false)
    }
  }

  async function deleteTopic(name: string) {
    if (!confirm(`delete topic "${name}"?`)) return
    setTopicsLoading(true)
    try {
      const res = await fetch('/api/topics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        setTopics(prev => prev.filter(t => t !== name))
      }
    } catch {} finally {
      setTopicsLoading(false)
    }
  }

  // Note management
  async function deleteNote(id: string) {
    if (!confirm('delete this note?')) return
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotes(prev => prev.filter(n => n.id !== id))
      } else {
        alert('failed to delete note')
      }
    } catch {
      alert('something went wrong')
    }
  }

  async function saveNoteTitle(id: string, title: string) {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (res.ok) {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, title } : n))
        setEditingNote(null)
      } else {
        alert('failed to update')
      }
    } catch {
      alert('something went wrong')
    }
  }

  if (success) {
    return <p className="text-muted-foreground text-sm">uploaded. redirecting...</p>
  }

  return (
    <div>
      {/* Tab selector */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab('upload')}
          className={`text-sm px-3 py-0.5 border transition-colors ${tab === 'upload' ? 'border-foreground text-foreground' : 'border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground'}`}
        >
          / new upload
        </button>
        <button
          onClick={() => setTab('manage')}
          className={`text-sm px-3 py-0.5 border transition-colors ${tab === 'manage' ? 'border-foreground text-foreground' : 'border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground'}`}
        >
          / manage
        </button>
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          {error && <p className="text-destructive text-sm">{error}</p>}

          <div>
            <label className="block text-muted-foreground text-xs mb-1 uppercase tracking-widest">
              title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Cauchy-Riemann Equations"
              className="w-full bg-background border border-border text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-muted-foreground"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs mb-1 uppercase tracking-widest">
              topic <span className="text-destructive">*</span>
            </label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full bg-background border border-border text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-muted-foreground"
              disabled={loading}
            >
              <option value="">-- select topic --</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground text-xs mb-1 uppercase tracking-widest">
              description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="optional notes or context"
              className="w-full bg-background border border-border text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-muted-foreground h-20 resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs mb-1 uppercase tracking-widest">
              pdf file <span className="text-destructive">*</span>
            </label>
            <label className="block w-full border border-border text-muted-foreground px-3 py-2 text-sm cursor-pointer hover:border-muted-foreground transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="sr-only"
                disabled={loading}
              />
              {form.file ? (
                <span className="text-foreground">{form.file.name} — {(form.file.size / 1024 / 1024).toFixed(2)}MB</span>
              ) : (
                <span>click to select file</span>
              )}
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="border border-muted-foreground text-muted-foreground text-sm px-4 py-1 hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'uploading...' : 'upload'}
            </button>
            <a
              href="/"
              className="border border-border text-muted-foreground text-sm px-4 py-1 hover:border-muted-foreground hover:text-foreground transition-colors"
            >
              cancel
            </a>
          </div>
        </form>
      )}

      {/* Manage tab */}
      {tab === 'manage' && (
        <div className="space-y-12 max-w-2xl">

          {/* Topics section */}
          <div>
            <p className="text-muted-foreground text-xs mb-4 uppercase tracking-widest">topics</p>

            {/* Add topic */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                placeholder="new topic name"
                className="flex-1 bg-background border border-border text-foreground px-3 py-1.5 font-mono text-sm focus:outline-none focus:border-muted-foreground"
                disabled={topicsLoading}
              />
              <button
                onClick={addTopic}
                disabled={topicsLoading || !newTopic.trim()}
                className="border border-muted-foreground text-muted-foreground text-sm px-3 py-1 hover:border-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                + add
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {topics.map(topic => (
                <div key={topic} className="flex items-center justify-between group py-0.5">
                  <span className="text-foreground text-sm before:content-['•'] before:mr-2 before:text-muted-foreground truncate">
                    {topic}
                  </span>
                  <button
                    onClick={() => deleteTopic(topic)}
                    className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition-all ml-2 shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border" />

          {/* Notes section */}
          <div>
            <p className="text-muted-foreground text-xs mb-4 uppercase tracking-widest">uploads ({notes.length})</p>

            {notesLoading ? (
              <p className="text-muted-foreground text-sm">loading...</p>
            ) : notes.length === 0 ? (
              <p className="text-muted-foreground text-sm">no notes yet.</p>
            ) : (
              <div className="space-y-1">
                {notes.map(note => (
                  <div key={note.id} className="flex items-center justify-between border-b border-muted py-2 group hover:border-foreground transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      {editingNote?.id === note.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingNote.title}
                            onChange={e => setEditingNote({ id: note.id, title: e.target.value })}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveNoteTitle(note.id, editingNote.title)
                              if (e.key === 'Escape') setEditingNote(null)
                            }}
                            className="flex-1 bg-background border border-muted-foreground text-foreground px-2 py-0.5 font-mono text-sm focus:outline-none"
                            autoFocus
                          />
                          <button onClick={() => saveNoteTitle(note.id, editingNote.title)} className="text-xs text-muted-foreground hover:text-foreground">save</button>
                          <button onClick={() => setEditingNote(null)} className="text-xs text-muted-foreground hover:text-foreground">esc</button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-foreground text-sm truncate block">{note.title}</span>
                          <span className="text-muted-foreground text-xs">{note.subject}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingNote({ id: note.id, title: note.title })}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TOPICS = [
  'gamma/beta',
  'cauchy-riemann eqs',
  'dilog/digamma',
  'yukawa derivation (non-rigorous)',
  'basic dynamics/dim analysis',
  'some calc iii',
  'general forces',
  'construction of natural numbers',
  'functional eqs',
  'construction of multiplication',
  'arithmetic function/mobius inverse',
  'manifolds',
  'kepler problem',
  'partial sums/divisor function',
  'intro to galois',
  'some groups',
  'basic graph theory',
  'spectral theorem for hermitian matrices',
  'analytic number theory',
  'rank 1/2 tensors',
  'jones vectors/em polarisation',
  'symplectic LA',
  'symplectic manifolds',
  'symplectomorphisms/moser theorem',
  'relative moser and darboux',
  'euler lagrange',
  'polarisation/su(2)',
  'quasihomomorphisms',
  'noetherian/artinian algebras',
  'lagrangian manifolds',
]

export function UploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    file: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('only PDF files are allowed')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('file too large (max 50MB)')
      return
    }
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

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

  if (success) {
    return <p className="text-muted-foreground text-sm">uploaded. redirecting...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {/* Title */}
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

      {/* Topic */}
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
          {TOPICS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Description */}
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

      {/* File */}
      <div>
        <label className="block text-muted-foreground text-xs mb-1 uppercase tracking-widest">
          pdf file <span className="text-destructive">*</span>
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full bg-background border border-border text-foreground px-3 py-2 font-mono text-sm focus:outline-none file:mr-4 file:bg-transparent file:border-0 file:text-muted-foreground file:font-mono file:text-sm cursor-pointer"
          disabled={loading}
        />
        {form.file && (
          <p className="text-muted-foreground text-xs mt-1">
            {form.file.name} — {(form.file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        )}
      </div>

      {/* Actions */}
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
  )
}

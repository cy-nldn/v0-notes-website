'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal } from './Terminal'

export function UploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    uploaded_by: '',
    file: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('$ error: only PDF files allowed')
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('$ error: file too large (max 50MB)')
        return
      }
      setForm(prev => ({ ...prev, file }))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!form.title || !form.subject || !form.file) {
        throw new Error('$ error: missing required fields')
      }

      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('subject', form.subject)
      formData.append('description', form.description)
      formData.append('uploaded_by', form.uploaded_by || 'anonymous')
      formData.append('file', form.file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || '$ error: upload failed')
      }

      setSuccess(true)
      setForm({ title: '', subject: '', description: '', uploaded_by: '', file: null })
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : '$ error: something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Terminal title="upload">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {error && (
          <div className="text-destructive border border-destructive p-3 font-mono text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="text-foreground border border-foreground p-3 font-mono text-sm bg-foreground/10">
            $ upload successful! redirecting...
          </div>
        )}

        <div>
          <label className="block text-foreground font-bold text-sm mb-2">
            $ title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Calculus Chapter 3"
            className="w-full bg-background border-2 border-foreground text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-secondary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-foreground font-bold text-sm mb-2">
            $ subject <span className="text-destructive">*</span>
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full bg-background border-2 border-foreground text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-secondary"
            disabled={loading}
          >
            <option value="">-- select subject --</option>
            <option value="Calculus">Calculus</option>
            <option value="Linear Algebra">Linear Algebra</option>
            <option value="Discrete Math">Discrete Math</option>
            <option value="Geometry">Geometry</option>
            <option value="Statistics">Statistics</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-foreground font-bold text-sm mb-2">
            $ description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="optional: add any notes or context"
            className="w-full bg-background border-2 border-foreground text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-secondary h-24 resize-none"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-foreground font-bold text-sm mb-2">
            $ uploaded by
          </label>
          <input
            type="text"
            name="uploaded_by"
            value={form.uploaded_by}
            onChange={handleChange}
            placeholder="optional: your name or email"
            className="w-full bg-background border-2 border-foreground text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-secondary"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-foreground font-bold text-sm mb-2">
            $ pdf file <span className="text-destructive">*</span>
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full bg-background border-2 border-foreground text-foreground px-3 py-2 font-mono text-sm focus:outline-none cursor-pointer"
            disabled={loading}
          />
          {form.file && (
            <p className="text-secondary text-sm mt-2">
              $ file selected: {form.file.name} ({(form.file.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || success}
            className="bg-foreground text-background px-6 py-2 font-bold hover:bg-secondary hover:text-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '$ uploading...' : '$ upload'}
          </button>
          <a
            href="/"
            className="bg-background border-2 border-foreground text-foreground px-6 py-2 font-bold hover:bg-foreground hover:text-background transition-colors inline-block"
          >
            $ cancel
          </a>
        </div>
      </form>
    </Terminal>
  )
}

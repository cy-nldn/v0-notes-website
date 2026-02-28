'use client'

import { useState } from 'react'

interface UploadAuthProps {
  onAuth: () => void
}

export function UploadAuth({ onAuth }: UploadAuthProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) throw new Error('invalid password')
      onAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
      <div>
        <label className="block text-muted-foreground text-xs mb-1 uppercase tracking-widest">
          password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-border text-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:border-muted-foreground"
          placeholder="enter password"
          disabled={loading}
          autoFocus
        />
        {error && (
          <p className="text-destructive text-xs mt-2">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !password}
        className="border border-muted-foreground text-muted-foreground text-sm px-4 py-1 hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'verifying...' : 'unlock'}
      </button>
    </form>
  )
}

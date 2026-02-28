'use client'

import { useState } from 'react'
import { Terminal } from './Terminal'

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

      if (!response.ok) {
        throw new Error('invalid password')
      }

      onAuth()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Terminal title="authentication_required">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
        <p className="text-muted-foreground text-sm">
          $ this upload area is password protected
        </p>

        {error && (
          <div className="text-destructive border border-destructive p-3 font-mono text-sm">
            $ error: {error}
          </div>
        )}

        <div>
          <label className="block text-foreground font-bold text-sm mb-2">
            $ password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-muted text-foreground px-3 py-2 font-mono text-sm border border-primary focus:outline-none focus:border-foreground"
            placeholder="enter password"
            disabled={loading}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || !password}
          className="bg-foreground text-background px-6 py-2 font-bold hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '$ verifying...' : '$ unlock'}
        </button>
      </form>
    </Terminal>
  )
}

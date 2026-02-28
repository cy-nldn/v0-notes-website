'use client'

import { useState } from 'react'
import { UploadAuth } from '@/components/UploadAuth'
import { UploadForm } from '@/components/UploadForm'
import Link from 'next/link'

export default function UploadPage() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <span className="font-bold text-foreground">misc. maths notes - chris</span>
            <span className="text-muted-foreground text-sm ml-3">
              {authenticated ? 'upload' : 'restricted'}
            </span>
          </div>
          <Link
            href="/"
            className="border border-muted-foreground text-muted-foreground text-sm px-3 py-0.5 hover:border-foreground hover:text-foreground transition-colors"
          >
            / back
          </Link>
        </div>

        <p className="text-muted-foreground text-sm mt-2 mb-6">
          {authenticated ? 'add a new note to the list.' : 'this area is password protected.'}
        </p>

        <hr className="border-border mb-8" />

        {authenticated ? (
          <UploadForm />
        ) : (
          <UploadAuth onAuth={() => setAuthenticated(true)} />
        )}

      </div>
    </main>
  )
}

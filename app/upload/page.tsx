'use client'

import { useState } from 'react'
import { UploadAuth } from '@/components/UploadAuth'
import { UploadForm } from '@/components/UploadForm'
import Link from 'next/link'

export default function UploadPage() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="glitch-wrap glitch-layer-1 max-w-5xl mx-auto px-8 py-12">

        {/* Centred header */}
        <div className="text-center mb-2">
          <h1 className="glitch-text font-light tracking-[0.25em] text-base uppercase text-foreground">
            c h r i s &apos; s &nbsp; r a n d o m &nbsp; m a t h s &nbsp; n o t e s
          </h1>
          <p className="text-muted-foreground text-xs tracking-widest mt-1">
            {authenticated ? 'upload / manage' : 'restricted access'}
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

        <p className="text-muted-foreground text-xs mb-8 tracking-wider">
          {authenticated ? 'add a new note or manage existing ones.' : 'this area is password protected.'}
        </p>

        {authenticated ? (
          <UploadForm />
        ) : (
          <UploadAuth onAuth={() => setAuthenticated(true)} />
        )}

      </div>
    </main>
  )
}

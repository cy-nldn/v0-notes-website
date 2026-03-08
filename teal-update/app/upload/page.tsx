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

        <div className="text-center mb-3">
          <h1 className="glitch-text font-light tracking-[0.3em] text-lg uppercase text-foreground">
            c h r i s &apos; s &nbsp; r a n d o m &nbsp; m a t h s &nbsp; n o t e s
          </h1>
          <p className="text-sm tracking-widest mt-2" style={{color:'#3a8f85'}}>
            {authenticated ? 'upload / manage' : 'restricted access'}
          </p>
        </div>

        <div className="flex justify-center mb-10 mt-5">
          <Link
            href="/"
            className="border text-sm px-5 py-1 tracking-widest uppercase transition-colors"
            style={{borderColor:'#3a8f85', color:'#3a8f85'}}
          >
            / back
          </Link>
        </div>

        <hr className="mb-8" style={{borderColor:'#152220'}} />

        <p className="text-sm mb-8 tracking-wider" style={{color:'#4a6b67'}}>
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

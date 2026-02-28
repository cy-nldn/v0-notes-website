'use client'

import Link from 'next/link'

export function HeaderButtons() {
  return (
    <div className="flex gap-4 pt-4">
      <Link
        href="/upload"
        className="bg-foreground text-background px-6 py-2 font-bold hover:bg-secondary hover:text-background transition-colors inline-block"
      >
        $ upload notes
      </Link>
      <button
        onClick={() => window.location.reload()}
        className="bg-background border-2 border-foreground text-foreground px-6 py-2 font-bold hover:bg-foreground hover:text-background transition-colors"
      >
        $ refresh
      </button>
    </div>
  )
}

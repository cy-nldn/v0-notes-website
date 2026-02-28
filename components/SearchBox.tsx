'use client'

export function SearchBox() {
  return (
    <div className="flex justify-end">
      <input
        type="text"
        placeholder="/ search..."
        className="bg-background border border-primary text-foreground placeholder-muted-foreground px-3 py-2 text-sm w-64 focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  )
}

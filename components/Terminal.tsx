import React from 'react'

interface TerminalProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Terminal({ title, children, className = '' }: TerminalProps) {
  return (
    <div className={`border-2 border-foreground bg-card ${className}`}>
      {title && (
        <div className="border-b-2 border-foreground px-4 py-2 flex items-center justify-between bg-card">
          <span className="text-foreground font-bold">$ {title}</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-foreground"></div>
            <div className="w-3 h-3 bg-foreground"></div>
            <div className="w-3 h-3 bg-foreground"></div>
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

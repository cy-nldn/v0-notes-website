import { UploadForm } from '@/components/UploadForm'
import { Terminal } from '@/components/Terminal'
import Link from 'next/link'

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 font-mono">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <Terminal title="upload_new_notes">
          <div className="space-y-2">
            <p className="text-foreground font-bold">$ preparing upload interface</p>
            <p className="text-muted-foreground text-sm">
              fill out the form below to share your notes
            </p>
          </div>
        </Terminal>

        {/* Upload Form */}
        <UploadForm />

        {/* Footer */}
        <Terminal>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              $ back to <Link href="/" className="text-foreground hover:text-secondary underline">notes list</Link>
            </p>
            <p className="text-muted-foreground text-xs">
              $ max file size: 50MB | only PDF
            </p>
          </div>
        </Terminal>
      </div>
    </main>
  )
}

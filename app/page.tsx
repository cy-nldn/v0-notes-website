import { createClient } from '@supabase/supabase-js'
import type { Note } from '@/lib/supabase'
import { NotesGrid } from '@/components/NotesGrid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getNotes(): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

async function getTopics(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('name')
      .order('name', { ascending: true })
    if (error || !data || data.length === 0) {
      return FALLBACK_TOPICS
    }
    return data.map((t: { name: string }) => t.name)
  } catch {
    return FALLBACK_TOPICS
  }
}

const FALLBACK_TOPICS = [
  'gamma/beta', 'cauchy-riemann eqs', 'dilog/digamma',
  'yukawa derivation (non-rigorous)', 'basic dynamics/dim analysis', 'some calc iii',
  'general forces', 'construction of natural numbers', 'functional eqs',
  'construction of multiplication', 'arithmetic function/mobius inverse', 'manifolds',
  'kepler problem', 'partial sums/divisor function', 'intro to galois',
  'some groups', 'basic graph theory', 'spectral theorem for hermitian matrices',
  'analytic number theory', 'rank 1/2 tensors', 'jones vectors/em polarisation',
  'symplectic LA', 'symplectic manifolds', 'symplectomorphisms/moser theorem',
  'relative moser and darboux', 'euler lagrange', 'polarisation/su(2)',
  'quasihomomorphisms', 'noetherian/artinian algebras', 'lagrangian manifolds',
]

export default async function Home() {
  const [notes, topics] = await Promise.all([getNotes(), getTopics()])

  return (
    <main className="min-h-screen bg-background text-foreground font-mono relative">
      <div className="glitch-bg" />
      <div className="glitch-content max-w-5xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <span className="font-bold text-foreground">misc. maths notes - chris</span>
            <span className="text-muted-foreground text-sm ml-3">{notes.length} entries</span>
          </div>
          <a
            href="/upload"
            className="border border-muted-foreground text-muted-foreground text-sm px-3 py-0.5 hover:border-foreground hover:text-foreground transition-colors"
          >
            / upload
          </a>
        </div>

        {/* ASCII art */}
        <pre className="text-muted-foreground text-xs leading-tight mt-4 mb-3 select-none">{`  /\\_/\\      /)__(\\     /)\\(\\      /\\ /\\  \n ( o.o )   ( o  o )  ((\\ oo /)) (( o  o ))\n  > ^ <     (  uu )   (  vv  )   (( >< ))  \n   cat       dog       rabbit     dragon   \n\n   /\\_______/\\                             \n  / |  . .  | \\  <-- tiger                 \n /  |  .v.  |  \\                           \n(___|_______|___)                          `}</pre>

        <p className="text-muted-foreground text-sm mb-6">
          some random notes ive taken :)
        </p>

        <hr className="border-border mb-6" />

        {/* Topics — 3 columns */}
        <div className="mb-8">
          <p className="text-muted-foreground text-xs mb-3">topics</p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1">
            {topics.map((topic) => (
              <span key={topic} className="text-foreground text-sm before:content-['•'] before:mr-2 before:text-muted-foreground">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-border mb-8" />

        {/* Notes Grid */}
        <NotesGrid notes={notes} />

      </div>
    </main>
  )
}

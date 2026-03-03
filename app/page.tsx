import { createClient } from '@supabase/supabase-js'
import type { Note } from '@/lib/supabase'
import { NotesGrid } from '@/components/NotesGrid'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  } catch { return [] }
}

async function getTopics(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('name')
      .order('name', { ascending: true })
    if (error || !data || data.length === 0) return FALLBACK_TOPICS
    return data.map((t: { name: string }) => t.name)
  } catch { return FALLBACK_TOPICS }
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
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="glitch-wrap glitch-layer-1 glitch-layer-2 max-w-5xl mx-auto px-8 py-12">

        {/* ── Scattered ASCII top-left ── */}
        <pre className="text-muted-foreground text-xs leading-tight select-none absolute left-4 top-8 opacity-20 hidden xl:block">{`  /\\_/\\
 ( -.-)
  > ♡ <
  kitty`}</pre>

        {/* ── Scattered ASCII top-right ── */}
        <pre className="text-muted-foreground text-xs leading-tight select-none absolute right-4 top-8 opacity-20 hidden xl:block">{`  |\\  /|
  | \\/ |
  |    |
  |____|
  piano`}</pre>

        {/* ── CENTRED HEADER ── */}
        <div className="text-center mb-2">
          <h1 className="glitch-text font-light tracking-[0.25em] text-base uppercase text-foreground">
            c h r i s &apos; s &nbsp; r a n d o m &nbsp; m a t h s &nbsp; n o t e s
          </h1>
          <p className="text-muted-foreground text-xs tracking-widest mt-1">
            {notes.length} entries &nbsp;·&nbsp; terminal v2
          </p>
        </div>

        {/* ── Nav ── */}
        <div className="flex justify-center mb-10 mt-4">
          <a
            href="/upload"
            className="border border-muted-foreground text-muted-foreground text-xs px-4 py-1 tracking-widest hover:border-foreground hover:text-foreground transition-colors uppercase"
          >
            / upload
          </a>
        </div>

        {/* ── ASCII strip ── */}
        <div className="flex justify-between items-end mb-8 opacity-30 select-none overflow-hidden">
          <pre className="text-muted-foreground text-xs leading-tight">{`  /\\_/\\
 ( o.o )
  > ^ <
   cat`}</pre>
          <pre className="text-muted-foreground text-xs leading-tight">{` /)__(\\
( o  o )
 (  uu )
  dog`}</pre>
          <pre className="text-muted-foreground text-xs leading-tight">{`  /)(\\
((\\ oo
 (  vv)
rabbit`}</pre>
          <pre className="text-muted-foreground text-xs leading-tight">{` /\\ /\\
(o  o )
(( >< ))
dragon`}</pre>
          <pre className="text-muted-foreground text-xs leading-tight">{`/\\_____/\\
| . . |
|  v  |
 tiger`}</pre>
        </div>

        <p className="text-muted-foreground text-xs mb-6 text-center tracking-wider">
          some random notes ive taken :)
        </p>

        <hr className="border-border mb-8" />

        {/* ── Topics — 3 columns ── */}
        <div className="mb-10">
          <p className="text-muted-foreground text-xs mb-4 tracking-widest uppercase">— topics —</p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1">
            {topics.map((topic) => (
              <span key={topic} className="text-foreground text-xs before:content-['›'] before:mr-2 before:text-muted-foreground">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-border mb-10" />

        {/* ── Notes — 2 columns ── */}
        <NotesGrid notes={notes} />

        {/* ── Footer ASCII ── */}
        <div className="mt-16 mb-4 flex justify-center opacity-15 select-none">
          <pre className="text-muted-foreground text-xs leading-tight">{`
    ___________________________
   |  _____________________  |
   | |                     | |
   | |   > maths.notes     | |
   | |   loading...        | |
   | |   ████████░░  80%   | |
   | |_____________________| |
   |_________________________|
          |           |
         /             \\
        /_______________\\
              |||
          ___|||___
         |_________|
             |||
          terminal`}</pre>
        </div>

      </div>
    </main>
  )
}

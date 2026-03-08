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
      .from('notes').select('*').order('created_at', { ascending: false })
    if (error) return []
    return data || []
  } catch { return [] }
}

async function getTopics(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('topics').select('name').order('name', { ascending: true })
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

        {/* ── corner ASCII — top left ── */}
        <pre className="teal-dim text-sm leading-tight select-none absolute left-6 top-6 opacity-40 hidden xl:block">{`  /\\_/\\
 ( -.-)
  > ♡ <
  kitty`}</pre>

        {/* ── corner ASCII — top right ── */}
        <pre className="teal-dim text-sm leading-tight select-none absolute right-6 top-6 opacity-40 hidden xl:block">{` /\\___/\\
(  o o  )
 \\  ^  /
  |||||
  bunny`}</pre>

        {/* ── CENTRED HEADER ── */}
        <div className="text-center mb-3">
          <h1 className="glitch-text font-light tracking-[0.3em] text-lg uppercase text-foreground">
            c h r i s &apos; s &nbsp; r a n d o m &nbsp; m a t h s &nbsp; n o t e s
          </h1>
          <p className="text-sm tracking-widest mt-2" style={{color:'#3a8f85'}}>
            {notes.length} entries &nbsp;·&nbsp; terminal v2
          </p>
        </div>

        {/* ── Nav ── */}
        <div className="flex justify-center mb-10 mt-5">
          <a
            href="/upload"
            className="border text-sm px-5 py-1 tracking-widest uppercase transition-colors"
            style={{borderColor:'#3a8f85', color:'#3a8f85'}}
            onMouseEnter={undefined}
          >
            / upload
          </a>
        </div>

        {/* ── ASCII animal strip — more visible ── */}
        <div className="flex justify-between items-end mb-10 select-none overflow-hidden" style={{opacity:0.55}}>
          <pre className="teal-dim text-sm leading-snug">{`   /\\_/\\
  ( o.o )
   > ^ <
    cat`}</pre>
          <pre className="teal-dim text-sm leading-snug">{`  /)__(\\
 ( o  o )
  (  uu )
   dog`}</pre>
          <pre className="teal-dim text-sm leading-snug">{`   /)(\\
 ((/ oo\\
  (  vv )
  rabbit`}</pre>
          <pre className="teal-dim text-sm leading-snug">{`  /\\ /\\
 (o  o )
 (( >< ))
  dragon`}</pre>
          <pre className="teal-dim text-sm leading-snug">{` /\\_____/\\
 | . . . |
 |   ^   |
  tiger`}</pre>
        </div>

        <p className="text-sm mb-6 text-center tracking-wider" style={{color:'#4a6b67'}}>
          some random notes ive taken :)
        </p>

        <hr className="mb-8" style={{borderColor:'#152220'}} />

        {/* ── Topics — 3 columns ── */}
        <div className="mb-10">
          <p className="text-sm mb-4 tracking-widest uppercase teal-dim">— topics —</p>
          <div className="grid grid-cols-3 gap-x-8 gap-y-1.5">
            {topics.map((topic) => (
              <span key={topic} className="text-sm text-foreground before:content-['›'] before:mr-2 before:teal" style={{'--tw-before-color':'#5ecfbf'} as React.CSSProperties}>
                <span style={{color:'#5ecfbf', marginRight:'0.5rem'}}>›</span>{topic}
              </span>
            ))}
          </div>
        </div>

        <hr className="mb-10" style={{borderColor:'#152220'}} />

        {/* ── Notes — 2 columns ── */}
        <NotesGrid notes={notes} />

        {/* ── Footer ASCII — bigger and more visible ── */}
        <div className="mt-20 mb-4 flex justify-center select-none" style={{opacity:0.35}}>
          <pre className="teal-dim text-sm leading-snug">{`
     _____________________________
    |   _______________________   |
    |  |                       |  |
    |  |   > maths.notes_      |  |
    |  |                       |  |
    |  |   loading corpus...   |  |
    |  |   [=========>  ] 88%  |  |
    |  |_______________________|  |
    |_____________________________|
            |           |
           / \\         / \\
          /   \\_______/   \\
                 |||
             ____|||____
            |___________|
                 |||
              terminal`}</pre>
        </div>

      </div>
    </main>
  )
}

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

const TOPICS = [
  'gamma/beta',
  'cauchy-riemann eqs',
  'dilog/digamma',
  'yukawa derivation (non-rigorous)',
  'basic dynamics/dim analysis',
  'some calc iii',
  'general forces',
  'construction of natural numbers',
  'functional eqs',
  'construction of multiplication',
  'arithmetic function/mobius inverse',
  'manifolds',
  'kepler problem',
  'partial sums/divisor function',
  'intro to galois',
  'some groups',
  'basic graph theory',
  'spectral theorem for hermitian matrices',
  'analytic number theory',
  'rank 1/2 tensors',
  'jones vectors/em polarisation',
  'symplectic LA',
  'symplectic manifolds',
  'symplectomorphisms/moser theorem',
  'relative moser and darboux',
  'euler lagrange',
  'polarisation/su(2)',
  'quasihomomorphisms',
  'noetherian/artinian algebras',
  'lagrangian manifolds',
]

export default async function Home() {
  const notes = await getNotes()

  return (
    <main className="min-h-screen bg-background text-foreground font-mono">
      <div className="max-w-4xl mx-auto px-8 py-10">

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

        {/* ASCII animal family */}
        <pre className="text-muted-foreground text-xs leading-tight mt-4 mb-3 select-none">{`  /\\_/\\      /)__(\\     /)\\(\\      /\\ /\\  
 ( o.o )   ( o  o )  ((\\ oo /)) (( o  o ))
  > ^ <     (  uu )   (  vv  )   (( >< ))  
   cat       dog       rabbit     dragon   

   /\\_______/\\          (\\(\\               
  / |  . .  | \\  <--   (='.')  tiger       
 /  |  .v.  |  \\       (")(")              
(___|_______|___)    @}-,-'-- flower        `}</pre>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6">
          some random notes ive taken :)
        </p>

        <hr className="border-border mb-6" />

        {/* Topics */}
        <div className="mb-8">
          <p className="text-muted-foreground text-xs mb-3">topics</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {TOPICS.map((topic) => (
              <span key={topic} className="text-foreground text-sm before:content-['•'] before:mr-2 before:text-muted-foreground">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-border mb-8" />

        {/* Notes */}
        <NotesGrid notes={notes} />

      </div>
    </main>
  )
}

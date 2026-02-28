-- Create topics table to allow dynamic topic management
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Anyone can read topics
CREATE POLICY "Allow public read" ON topics
  FOR SELECT USING (true);

-- Allow inserts (guarded by app-level password auth)
CREATE POLICY "Allow public insert" ON topics
  FOR INSERT WITH CHECK (true);

-- Seed with existing topics
INSERT INTO topics (name) VALUES
  ('gamma/beta'),
  ('cauchy-riemann eqs'),
  ('dilog/digamma'),
  ('yukawa derivation (non-rigorous)'),
  ('basic dynamics/dim analysis'),
  ('some calc iii'),
  ('general forces'),
  ('construction of natural numbers'),
  ('functional eqs'),
  ('construction of multiplication'),
  ('arithmetic function/mobius inverse'),
  ('manifolds'),
  ('kepler problem'),
  ('partial sums/divisor function'),
  ('intro to galois'),
  ('some groups'),
  ('basic graph theory'),
  ('spectral theorem for hermitian matrices'),
  ('analytic number theory'),
  ('rank 1/2 tensors'),
  ('jones vectors/em polarisation'),
  ('symplectic LA'),
  ('symplectic manifolds'),
  ('symplectomorphisms/moser theorem'),
  ('relative moser and darboux'),
  ('euler lagrange'),
  ('polarisation/su(2)'),
  ('quasihomomorphisms'),
  ('noetherian/artinian algebras'),
  ('lagrangian manifolds');

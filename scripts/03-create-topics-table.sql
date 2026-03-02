-- Create topics table
create table if not exists topics (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Seed with default topics
insert into topics (name) values
  ('gamma/beta'), ('cauchy-riemann eqs'), ('dilog/digamma'),
  ('yukawa derivation (non-rigorous)'), ('basic dynamics/dim analysis'), ('some calc iii'),
  ('general forces'), ('construction of natural numbers'), ('functional eqs'),
  ('construction of multiplication'), ('arithmetic function/mobius inverse'), ('manifolds'),
  ('kepler problem'), ('partial sums/divisor function'), ('intro to galois'),
  ('some groups'), ('basic graph theory'), ('spectral theorem for hermitian matrices'),
  ('analytic number theory'), ('rank 1/2 tensors'), ('jones vectors/em polarisation'),
  ('symplectic la'), ('symplectic manifolds'), ('symplectomorphisms/moser theorem'),
  ('relative moser and darboux'), ('euler lagrange'), ('polarisation/su(2)'),
  ('quasihomomorphisms'), ('noetherian/artinian algebras'), ('lagrangian manifolds')
on conflict (name) do nothing;

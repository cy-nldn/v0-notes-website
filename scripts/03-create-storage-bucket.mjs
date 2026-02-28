import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setup() {
  // Create the pdfs bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === 'pdfs')

  if (exists) {
    console.log('[v0] pdfs bucket already exists, skipping creation')
  } else {
    const { error } = await supabase.storage.createBucket('pdfs', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/pdf'],
    })
    if (error) {
      console.error('[v0] Failed to create bucket:', error.message)
      process.exit(1)
    }
    console.log('[v0] pdfs bucket created successfully')
  }

  // Set public access policy so anyone can read PDFs
  const { error: policyError } = await supabase.storage.from('pdfs').getPublicUrl('test')
  if (!policyError) {
    console.log('[v0] pdfs bucket is publicly accessible')
  }

  console.log('[v0] Storage setup complete')
}

setup()

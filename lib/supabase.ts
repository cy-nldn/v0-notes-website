import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Note {
  id: string
  title: string
  subject: string
  description: string | null
  file_path: string
  file_size: number
  uploaded_by: string | null
  view_count: number
  created_at: string
  updated_at: string
}

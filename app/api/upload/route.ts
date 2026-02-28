import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subject = formData.get('subject') as string
    const description = formData.get('description') as string
    const uploadedBy = formData.get('uploaded_by') as string

    if (!file || !title || !subject) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const filename = `${Date.now()}-${file.name}`

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(filename, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      return NextResponse.json(
        { message: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // Insert note metadata into database
    const { data: noteData, error: dbError } = await supabase
      .from('notes')
      .insert({
        title,
        subject,
        description: description || null,
        file_path: storageData.path,
        file_size: file.size,
        uploaded_by: uploadedBy || 'chris',
        view_count: 0,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { message: 'Failed to save note metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Note uploaded successfully', note: noteData },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

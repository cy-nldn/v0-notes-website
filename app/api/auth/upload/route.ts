import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Get the upload password from environment variable
    const uploadPassword = process.env.UPLOAD_PASSWORD

    if (!uploadPassword) {
      return NextResponse.json(
        { message: 'server misconfigured' },
        { status: 500 }
      )
    }

    if (password === uploadPassword) {
      // Set a secure cookie with the authenticated session
      const response = NextResponse.json({ success: true })
      response.cookies.set({
        name: 'upload_auth',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
      })
      return response
    } else {
      return NextResponse.json(
        { message: 'invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { message: 'authentication failed' },
      { status: 400 }
    )
  }
}

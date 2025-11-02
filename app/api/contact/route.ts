import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Minimal: log the submission. In production, wire this to email provider or DB.
    console.log('Contact submission:', body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error processing contact submission', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

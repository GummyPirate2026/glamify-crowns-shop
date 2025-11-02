// Temporarily disabled authentication for testing
// TODO: Re-enable authentication once admin panel is working
import { NextResponse } from "next/server"

export function middleware(req: Request) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}

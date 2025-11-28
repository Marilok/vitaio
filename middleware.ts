import { NextResponse, type NextRequest } from "next/server";
// import { updateSession } from '@/lib/supabase/middleware';

// Simple passthrough middleware - uncomment the updateSession logic below when ready to use Supabase auth
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(request: NextRequest) {
  // Uncomment below to enable Supabase authentication middleware:
  // return await updateSession(request);

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

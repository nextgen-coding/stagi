import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sign-out(.*)',
  '/sso-callback',
  '/internships(.*)',
  '/api/internships(.*)',
  '/api/uploadthing(.*)', // UploadThing callbacks must be public
])

// Routes that should redirect to dashboard versions when authenticated
const dashboardRedirectRoutes = createRouteMatcher([
  '/internship/(.*)',
  '/apply/(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const url = request.nextUrl
  
  // Redirect authenticated users from /internship/[id] to dashboard version
  if (userId && dashboardRedirectRoutes(request)) {
    // Already in the dashboard layout, let it through
    if (url.pathname.startsWith('/dashboard/') || url.pathname.startsWith('/admin/')) {
      return NextResponse.next()
    }
    
    // The (dashboard) route group doesn't change the URL, so these paths work directly
    // No redirect needed - the route groups handle this
  }
  
  if (!isPublicRoute(request) && !dashboardRedirectRoutes(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

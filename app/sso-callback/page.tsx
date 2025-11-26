'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function SSOCallback() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Only run redirect logic after auth is loaded and user is signed in
    // Add a small delay to ensure Clerk's callback has completed
    if (isLoaded && isSignedIn && !isRedirecting) {
      setIsRedirecting(true)
      
      // Use setTimeout to ensure this runs after Clerk's own redirect logic
      const timer = setTimeout(() => {
        // Check if there's an internship to apply to (highest priority)
        const applyToInternshipId = localStorage.getItem('applyToInternshipId')
        if (applyToInternshipId) {
          console.log('[SSO] Redirecting to apply:', applyToInternshipId)
          localStorage.removeItem('applyToInternshipId')
          localStorage.removeItem('redirectAfterAuth')
          localStorage.removeItem('pendingApplicationId')
          router.replace(`/apply/${applyToInternshipId}`)
          return
        }
        
        // Check if there's a redirect URL from localStorage
        const redirectAfterAuth = localStorage.getItem('redirectAfterAuth')
        if (redirectAfterAuth) {
          console.log('[SSO] Redirecting to:', redirectAfterAuth)
          localStorage.removeItem('redirectAfterAuth')
          router.replace(redirectAfterAuth)
          return
        }
        
        // Check if there's a pending application (fallback)
        const pendingApplicationId = localStorage.getItem('pendingApplicationId')
        if (pendingApplicationId) {
          console.log('[SSO] Redirecting to pending application:', pendingApplicationId)
          localStorage.removeItem('pendingApplicationId')
          router.replace(`/apply/${pendingApplicationId}`)
          return
        }
        
        // Default: go to dashboard
        console.log('[SSO] Redirecting to dashboard')
        router.replace('/dashboard')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, isRedirecting, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
            S
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Stagi
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Please wait while we redirect you.
        </p>
      </div>
      <AuthenticateWithRedirectCallback 
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
    </div>
  )
}

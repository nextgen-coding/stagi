'use client'

import { AuthLayout } from '@/components/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState, useEffect } from 'react'
import { useSignIn, useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useUser()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const redirectUrl = searchParams?.get('redirect')
  const redirectQuery = redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      if (redirectUrl) {
        router.replace(redirectUrl)
      } else {
        router.replace('/dashboard')
      }
    }
  }, [isLoaded, isSignedIn, redirectUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })

        // Preserve any pending application target so we can redirect back to the stepper
        const pendingApplicationId = localStorage.getItem('pendingApplicationId')
        if (pendingApplicationId) {
          localStorage.setItem('applyToInternshipId', pendingApplicationId)
          localStorage.removeItem('pendingApplicationId')
        }

        const savedApplyTarget = localStorage.getItem('applyToInternshipId')

        if (redirectUrl) {
          router.push(redirectUrl)
        } else if (savedApplyTarget) {
          router.push(`/apply/${savedApplyTarget}`)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (strategy: 'oauth_google' | 'oauth_github') => {
    if (!isLoaded) return

    try {
      let targetUrl = '/dashboard'
      
      // Save redirect URL and internship ID BEFORE OAuth redirect
      if (redirectUrl) {
        console.log('[OAuth] Using redirect URL:', redirectUrl)
        targetUrl = redirectUrl
        localStorage.setItem('redirectAfterAuth', redirectUrl)
        
        // Also extract and save the internship ID from redirect URL
        // Format: /apply/{id}
        const match = redirectUrl.match(/\/apply\/(.+)/)
        if (match && match[1]) {
          console.log('[OAuth] Saving applyToInternshipId:', match[1])
          localStorage.setItem('applyToInternshipId', match[1])
        }
      } else {
        // Check if there's a pending application in localStorage
        const pendingApplicationId = localStorage.getItem('pendingApplicationId')
        if (pendingApplicationId) {
          console.log('[OAuth] Found pendingApplicationId, saving as applyToInternshipId:', pendingApplicationId)
          localStorage.setItem('applyToInternshipId', pendingApplicationId)
          targetUrl = `/apply/${pendingApplicationId}`
        }
      }
      
      console.log('[OAuth] Starting redirect to:', strategy, 'with target:', targetUrl)
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: targetUrl,
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'OAuth sign in failed')
    }
  }

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Enter your email and password to access your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sellostore@company.com"
              required
              className="h-11 pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 pl-10 pr-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Remember Me
            </label>
          </div>
          <Link 
            href="#" 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot Your Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Log In'
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
              Or Login With
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={() => handleOAuthSignIn('oauth_google')}
            variant="outline"
            className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <GoogleIcon />
            <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">Google</span>
          </Button>
          <Button
            type="button"
            onClick={() => handleOAuthSignIn('oauth_github')}
            variant="outline"
            className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <GithubIcon />
            <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">GitHub</span>
          </Button>
        </div>

        <div className="text-center pt-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Don't Have An Account?{' '}
          </span>
          <Link 
            href={`/sign-up${redirectQuery}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register Now.
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}


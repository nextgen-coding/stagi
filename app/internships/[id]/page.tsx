'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  User,
  Menu,
  X,
  Sparkles,
  Building2,
  ArrowRight
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useUser } from '@clerk/nextjs'

// Gradient Flare Component - Pure Blue Theme
const GradientFlare = ({ className = "", variant = "primary" }: { className?: string, variant?: "primary" | "secondary" | "accent" }) => {
  const colors = {
    primary: "from-blue-600/40 via-sky-500/30 to-cyan-400/20",
    secondary: "from-sky-500/35 via-blue-600/25 to-indigo-500/20",
    accent: "from-cyan-400/30 via-blue-500/25 to-sky-600/20"
  }
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className={`absolute w-[600px] h-[600px] bg-gradient-to-br ${colors[variant]} rounded-full blur-[100px] opacity-60`} />
    </div>
  )
}

interface Internship {
  id: string
  title: string
  department: string
  description: string
  requirements: string | null
  location: string | null
  duration: string | null
  isOpen: boolean
}

export default function InternshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchInternship(params.id as string)
    }
  }, [params.id])

  const fetchInternship = async (id: string) => {
    try {
      const res = await fetch(`/api/internships/${id}`)
      const data = await res.json()
      
      if (data.success) {
        setInternship(data.internship)
      }
    } catch (error) {
      console.error('Failed to fetch internship:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!isSignedIn) {
      localStorage.setItem('applyToInternshipId', params.id as string)
      router.push(`/sign-in?redirect=/apply/${params.id}`)
    } else {
      router.push(`/apply/${params.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 dark:border-slate-800 border-t-blue-500"></div>
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-500/20">
            <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Internship Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            This internship may have been closed or removed. Please browse our other open positions.
          </p>
          <Link href="/internships/browse">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-8 font-semibold shadow-lg shadow-blue-500/30">
              Browse All Internships
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 text-slate-900 dark:text-white overflow-hidden relative">
      {/* Background Gradient Flares */}
      <GradientFlare className="-top-32 -right-32" variant="primary" />
      <GradientFlare className="top-[60%] -left-64" variant="secondary" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Stagi
            </span>
          </Link>
          
          {/* Desktop Navigation - Centered */}
          <div className="flex items-center gap-8">
            <Link href="/internships/browse" className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Internships
            </Link>
            <Link href="/#team" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Team
            </Link>
            <Link href="/#careers" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Careers
            </Link>
            <Link href="/#about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isSignedIn ? (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all border-0">
                    Get started!
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all border-0">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative pt-24 pb-16 sm:pt-28">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <Link 
            href="/internships/browse" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all internships</span>
          </Link>

          {/* Main Card */}
          <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center flex-shrink-0 ring-1 ring-blue-500/20">
                  <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {internship.title}
                  </h1>
                  <p className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400">
                    {internship.department}
                  </p>
                </div>
              </div>
              {internship.isOpen ? (
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/30 text-sm font-medium px-4 py-1.5 self-start">
                  Open for Applications
                </Badge>
              ) : (
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30 text-sm font-medium px-4 py-1.5 self-start">
                  Closed
                </Badge>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {internship.location && (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{internship.location}</span>
                </div>
              )}
              {internship.duration && (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{internship.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Stagi</span>
              </div>
            </div>

            {/* Apply Button */}
            <Button 
              onClick={handleApply}
              disabled={!internship.isOpen}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {internship.isOpen ? 'Apply Now' : 'Applications Closed'}
              {internship.isOpen && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {/* Description */}
          <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              About the Role
            </h2>
            <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
              {internship.description}
            </p>
          </div>

          {/* Requirements */}
          {internship.requirements && (
            <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                Requirements
              </h2>
              <div className="space-y-3">
                {internship.requirements.split('\n').filter(req => req.trim()).map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 text-sm">{req.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-slate-800 dark:via-blue-900/50 dark:to-slate-800 rounded-2xl p-6 sm:p-8 text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 rounded-full blur-[60px]" />
            </div>
            
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-4 ring-1 ring-blue-400/30">
                <User className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ready to Apply?
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                {isSignedIn 
                  ? "Complete your application and take the next step in your career."
                  : "Sign in or create an account to complete your application."
                }
              </p>
              <Button 
                onClick={handleApply}
                disabled={!internship.isOpen}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50"
              >
                {internship.isOpen ? 'Start Application' : 'Applications Closed'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
                S
              </div>
              <span className="text-base font-semibold text-slate-900 dark:text-white">
                Stagi
              </span>
            </Link>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              © 2025 Stagi Enterprises LTD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

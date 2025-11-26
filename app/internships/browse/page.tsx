'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  X, 
  Menu, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

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
  location: string | null
  duration: string | null
  isOpen: boolean
}

export default function BrowseInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchInternships()
  }, [search, department])

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (department !== 'all') params.append('department', department)

      const res = await fetch(`/api/internships?${params}`)
      const data = await res.json()
      setInternships(data.internships || [])
    } catch (error) {
      console.error('Failed to fetch internships:', error)
    } finally {
      setLoading(false)
    }
  }

  const departments = ['all', 'Engineering', 'Product', 'Design', 'Marketing', 'Data Science', 'Research']

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 text-slate-900 dark:text-white overflow-hidden relative">
      {/* Background Gradient Flares */}
      <GradientFlare className="-top-32 -right-32" variant="primary" />
      <GradientFlare className="top-[40%] -left-64" variant="secondary" />
      <GradientFlare className="bottom-0 right-0" variant="accent" />

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
            <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all border-0">
                Get started!
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-8 sm:pt-32 sm:pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200/50 dark:border-blue-700/30 text-slate-600 dark:text-slate-300 text-xs font-medium mb-5 shadow-sm">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{internships.length} Open Positions</span>
              <Sparkles className="w-3 h-3 text-blue-500" />
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.15]">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">AI Internship</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Explore opportunities across engineering, design, product, and more. Start your journey with us today.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search internships by title, description, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Department Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDepartment(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    department === dept
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-600/50 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {dept === 'all' ? 'All Departments' : dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Internships Grid */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 dark:border-slate-800 border-t-blue-500"></div>
            </div>
          ) : internships.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {internships.map((internship) => (
                <Link 
                  key={internship.id} 
                  href={`/internships/${internship.id}`}
                  className="group"
                >
                  <div className="h-full bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                        <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      {internship.isOpen ? (
                        <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/30 text-xs font-medium">
                          Open
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30 text-xs font-medium">
                          Closed
                        </Badge>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {internship.title}
                      </h3>
                      
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                        {internship.department}
                      </p>
                      
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                        {internship.description}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                        {internship.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{internship.location}</span>
                          </div>
                        )}
                        {internship.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{internship.duration}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Apply now
                        </span>
                        <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No internships found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                We couldn't find any internships matching your criteria. Try adjusting your search or filters.
              </p>
              <Button
                onClick={() => {
                  setSearch('')
                  setDepartment('all')
                }}
                variant="outline"
                className="rounded-full px-6 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-slate-900 dark:via-blue-950/50 dark:to-slate-900 overflow-hidden">
        {/* CTA Background Flare */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to start your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI career</span>?
          </h2>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Create an account to apply for internships and track your applications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full px-8 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                Create Account
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-blue-400/30 text-white hover:bg-blue-500/10 hover:border-blue-400/50 transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

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

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowLeft, Briefcase, Check, FileText, GraduationCap, Loader2, User, MapPin, Calendar, Menu, X } from 'lucide-react'

interface Internship {
  id: string
  title: string
  department: string
  description: string
  location: string | null
  duration: string | null
}

interface ApplicationData {
  fullName: string
  email: string
  phone: string
  education: string
  experience: string
  whyInterested: string
  availability: string
  resumeUrl: string
  coverLetter: string
  linkedinUrl: string
  githubUrl: string
}

const steps = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Education', icon: GraduationCap },
  { id: 3, label: 'Experience', icon: Briefcase },
  { id: 4, label: 'Review', icon: FileText },
]

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()

  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [isPrefilled, setIsPrefilled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    whyInterested: '',
    availability: '',
    resumeUrl: '',
    coverLetter: '',
    linkedinUrl: '',
    githubUrl: '',
  })

  // Ensure only authenticated users access this page
  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn && params.id) {
      localStorage.setItem('applyToInternshipId', params.id as string)
      router.replace(`/sign-in?redirect_url=/apply/${params.id}`)
    }
  }, [isLoaded, isSignedIn, params.id, router])

  useEffect(() => {
    if (!params.id || !isSignedIn) return

    const loadInternship = async () => {
      try {
        const res = await fetch(`/api/internships/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setInternship(data.internship)
        }
      } catch (error) {
        console.error('Failed to fetch internship', error)
      } finally {
        setLoading(false)
      }
    }

    loadInternship()

    // hydrate form data from localStorage or user profile
    const saved = localStorage.getItem(`application_${params.id}`)
    if (saved) {
      try {
        const savedData = JSON.parse(saved)
        const hasSavedProgress = savedData.education || savedData.experience || savedData.whyInterested
        if (hasSavedProgress) {
          setIsPrefilled(true)
        }
        setFormData({
          fullName: savedData.fullName || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''),
          email: savedData.email || (user?.primaryEmailAddress?.emailAddress || ''),
          phone: savedData.phone || (user?.primaryPhoneNumber?.phoneNumber || ''),
          education: savedData.education || '',
          experience: savedData.experience || '',
          whyInterested: savedData.whyInterested || '',
          availability: savedData.availability || '',
          resumeUrl: savedData.resumeUrl || '',
          coverLetter: savedData.coverLetter || '',
          linkedinUrl: savedData.linkedinUrl || '',
          githubUrl: savedData.githubUrl || '',
        })
      } catch (e) {
        console.error('Failed to parse saved application data', e)
        if (user) {
          setFormData(prev => ({
            ...prev,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.primaryEmailAddress?.emailAddress || '',
            phone: user.primaryPhoneNumber?.phoneNumber || '',
          }))
        }
      }
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
      }))
    }
  }, [params.id, isSignedIn, user])

  // autosave
  useEffect(() => {
    if (!params.id) return
    localStorage.setItem(`application_${params.id}`, JSON.stringify(formData))
  }, [formData, params.id])

  const updateField = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId: params.id,
          ...formData,
        }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.removeItem(`application_${params.id}`)
        localStorage.removeItem('applyToInternshipId')
        router.push('/dashboard/applications?success=true')
      } else {
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Failed to submit application', error)
      alert('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const stepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone
      case 2:
        return !!formData.education
      case 3:
        return formData.experience && formData.whyInterested && formData.availability
      default:
        return true
    }
  }

  if (!isLoaded || (!isSignedIn && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Internship not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 text-slate-900 dark:text-white overflow-hidden relative">
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
          <div className="hidden md:flex items-center gap-8">
            <Link href="/internships/browse" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
            {isSignedIn ? (
              <Link href="/dashboard" className="hidden sm:block">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all border-0">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link href="/sign-up" className="hidden sm:block">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all border-0">
                    Get started!
                  </Button>
                </Link>
              </>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="px-6 py-4 space-y-1">
              <Link 
                href="/internships/browse" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
              >
                Browse internships
              </Link>
              <Link 
                href="/#team" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Team
              </Link>
              <Link 
                href="/#careers" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Careers
              </Link>
              <Link 
                href="/#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                About
              </Link>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {isSignedIn ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/sign-in" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30">
                        Get started!
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="relative pt-24 pb-16 sm:pt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href={`/internship/${internship.id}`} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to internship details
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Apply for <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{internship.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {internship.department}
            </span>
            {internship.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {internship.location}
              </span>
            )}
            {internship.duration && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {internship.duration}
              </span>
            )}
          </div>
        </div>

        {/* Progress Restored Banner */}
        {isPrefilled && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3 mb-6">
            <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Welcome back!</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your application progress has been restored. Continue where you left off.
              </p>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          {/* Progress Bar */}
          <div className="relative mb-8">
            {/* Background Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700" />
            {/* Progress Line */}
            <div 
              className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === step.id
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-110'
                      : currentStep > step.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`mt-3 text-xs font-medium transition-colors ${
                    currentStep >= step.id 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center">
                {(() => {
                  const StepIcon = steps[currentStep - 1].icon
                  return <StepIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                })()}
              </div>
              {steps[currentStep - 1].label}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => updateField('fullName', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={e => updateField('linkedinUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">GitHub Profile</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={e => updateField('githubUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Education Background *</label>
                  <textarea
                    value={formData.education}
                    onChange={e => updateField('education', e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="School name, degree, major, GPA, relevant coursework, honors/awards..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Resume URL</label>
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={e => updateField('resumeUrl', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://drive.google.com/... or https://..."
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Link to your resume on Google Drive, Dropbox, or personal website</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Relevant Experience *</label>
                  <textarea
                    value={formData.experience}
                    onChange={e => updateField('experience', e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Previous internships, projects, work experience, volunteer work..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Why are you interested in this internship? *</label>
                  <textarea
                    value={formData.whyInterested}
                    onChange={e => updateField('whyInterested', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="What excites you about this opportunity? How does it align with your goals?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Availability *</label>
                  <textarea
                    value={formData.availability}
                    onChange={e => updateField('availability', e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="When can you start? How many hours per week can you commit?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Cover Letter (Optional)</label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={e => updateField('coverLetter', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Anything else you'd like us to know?"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-500 dark:text-slate-400">Name:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.fullName}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400">Email:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.email}</span></div>
                    <div><span className="text-slate-500 dark:text-slate-400">Phone:</span> <span className="text-slate-900 dark:text-white font-medium">{formData.phone}</span></div>
                    {formData.linkedinUrl && <div className="truncate"><span className="text-slate-500 dark:text-slate-400">LinkedIn:</span> <span className="text-blue-600 dark:text-blue-400 font-medium">{formData.linkedinUrl}</span></div>}
                    {formData.githubUrl && <div className="truncate"><span className="text-slate-500 dark:text-slate-400">GitHub:</span> <span className="text-blue-600 dark:text-blue-400 font-medium">{formData.githubUrl}</span></div>}
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Education
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{formData.education}</p>
                  {formData.resumeUrl && (
                    <p className="mt-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Resume:</span> <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{formData.resumeUrl}</a></p>
                  )}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Experience
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{formData.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Why Interested</h4>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{formData.whyInterested}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">Availability</h4>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{formData.availability}</p>
                  </div>
                  {formData.coverLetter && (
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-1">Cover Letter</h4>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{formData.coverLetter}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 dark:border-slate-700/50">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 1}
                className="rounded-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep} 
                  disabled={!stepValid()}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitting} 
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

import { getInternshipById } from '@/app/actions/internships'
import { getUserApplications } from '@/app/actions/applications'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Briefcase, ArrowLeft, Users, LogIn, CheckCircle2 } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import type { ApplicationWithRelations } from '@/lib/types'

export default async function InternshipDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth()
  
  const internshipResult = await getInternshipById(id)
  
  if (!internshipResult.success || !internshipResult.data) {
    notFound()
  }
  
  const internship = internshipResult.data
  
  // Check if user has applied (only for authenticated users)
  let hasApplied = false
  if (userId) {
    const applicationsResult = await getUserApplications()
    if (applicationsResult.success) {
      const applications = applicationsResult.data as ApplicationWithRelations[]
      hasApplied = applications.some((app) => app.internshipId === id)
    }
  }
  
  // Authenticated user view
  if (userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        {/* Header for Authenticated Users */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                  S
                </div>
                <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Stagi
                </span>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-slate-300 dark:border-slate-600 dark:text-slate-300">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          {/* Header Card */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2" />
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                      {internship.title}
                    </CardTitle>
                    {internship.isOpen ? (
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                        Open
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        Closed
                      </Badge>
                    )}
                    {hasApplied && (
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Applied
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
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
                
                {/* Apply Button for Authenticated Users */}
                {internship.isOpen && !hasApplied && (
                  <Link href={`/apply/${id}`}>
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                      Apply Now
                    </Button>
                  </Link>
                )}
                {hasApplied && (
                  <Link href="/dashboard/applications">
                    <Button size="lg" variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400">
                      View My Application
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
          </Card>
          
          {/* Content */}
          <div className="grid gap-6">
            {/* Description */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">About This Internship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {internship.description}
                </p>
              </CardContent>
            </Card>
            
            {/* Requirements */}
            {internship.requirements && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {internship.requirements}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Stats */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Application Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Users className="h-5 w-5" />
                  <span>{internship._count.applications} application{internship._count.applications !== 1 ? 's' : ''} received</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
  
  // Non-authenticated user view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header for Non-Authenticated Users */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
                S
              </div>
              <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Stagi
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="outline" className="border-slate-300 dark:border-slate-600 dark:text-slate-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/internships" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Internships</span>
        </Link>
        
        {/* Header Card */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2" />
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                    {internship.title}
                  </CardTitle>
                  {internship.isOpen ? (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800">
                      Open
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Closed
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
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
              
              {/* Sign In to Apply Button */}
              {internship.isOpen && (
                <Link href={`/sign-in?redirect_url=/apply/${id}`}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Apply
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
        </Card>
        
        {/* Content */}
        <div className="grid gap-6">
          {/* Description */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 dark:text-white">About This Internship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {internship.description}
              </p>
            </CardContent>
          </Card>
          
          {/* Requirements */}
          {internship.requirements && (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 dark:text-white">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {internship.requirements}
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Stats */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 dark:text-white">Application Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Users className="h-5 w-5" />
                <span>{internship._count.applications} application{internship._count.applications !== 1 ? 's' : ''} received</span>
              </div>
            </CardContent>
          </Card>
          
          {/* CTA for Sign Up */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Apply?</h3>
              <p className="text-blue-100 mb-6 max-w-lg mx-auto">
                Create an account to apply for this internship and track your application status.
              </p>
              <div className="flex justify-center gap-4">
                <Link href={`/sign-in?redirect_url=/apply/${id}`}>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    Sign In
                  </Button>
                </Link>
                <Link href={`/sign-up?redirect_url=/apply/${id}`}>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

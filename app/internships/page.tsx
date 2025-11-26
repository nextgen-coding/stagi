import { getOpenInternships } from '@/app/actions/internships'
import { getUserApplications } from '@/app/actions/applications'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Briefcase, MapPin, Calendar, Users, Search, ArrowLeft } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { InternshipWithCount, ApplicationWithRelations } from '@/lib/types'

export default async function InternshipsPage() {
  const { userId } = await auth()
  
  // Redirect authenticated users to dashboard browse
  if (userId) {
    redirect('/dashboard/browse')
  }
  
  const internshipsResult = await getOpenInternships()
  const openInternships = (internshipsResult.success ? internshipsResult.data : []) as InternshipWithCount[]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Simple Header for Public View */}
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Open Internships
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore exciting opportunities to join our team and grow your career
          </p>
        </div>
        
        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Open Internships</CardTitle>
              <Briefcase className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{openInternships.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Departments</CardTitle>
              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {new Set(openInternships.map(i => i.department)).size}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Applications</CardTitle>
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {openInternships.reduce((sum, i) => sum + i._count.applications, 0)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Internships Grid */}
        {openInternships.length === 0 ? (
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Open Internships</h3>
              <p className="text-slate-600 dark:text-slate-400">Check back soon for new opportunities!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openInternships.map((internship) => (
              <Card key={internship.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 line-clamp-2 text-slate-900 dark:text-white">{internship.title}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        {internship.department}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardDescription className="space-y-2 text-slate-600 dark:text-slate-400">
                    {internship.location && (
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="h-4 w-4" />
                        {internship.location}
                      </span>
                    )}
                    {internship.duration && (
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {internship.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      {internship._count.applications} applicant{internship._count.applications !== 1 ? 's' : ''}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {internship.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Link href={`/internship/${internship.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-slate-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700" size="sm">
                        View Details
                      </Button>
                    </Link>
                    
                    <Link href={`/sign-in?redirect_url=/apply/${internship.id}`} className="flex-1">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                        size="sm"
                      >
                        Apply
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join our team and gain hands-on experience in your field. Apply to internships that match your interests and career goals.
              </p>
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Create Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

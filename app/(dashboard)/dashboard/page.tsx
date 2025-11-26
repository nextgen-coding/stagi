import { getUserApplications } from '@/app/actions/applications'
import { getOpenInternships } from '@/app/actions/internships'
import { syncUser } from '@/app/actions/users'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Briefcase, 
  Clock, 
  MapPin, 
  Calendar, 
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ApplicationStatus } from '@prisma/client'
import type { ApplicationWithRelations, InternshipWithCount } from '@/lib/types'

const statusColors: Record<ApplicationStatus, string> = {
  PENDING: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  REVIEWING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  ACCEPTED: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
}

const statusLabels: Record<ApplicationStatus, string> = {
  PENDING: 'Pending Review',
  REVIEWING: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
}

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  // Sync user to database if not exists
  await syncUser()
  
  const [applicationsResult, internshipsResult] = await Promise.all([
    getUserApplications(),
    getOpenInternships()
  ])
  
  const applications = (applicationsResult.success ? applicationsResult.data : []) as ApplicationWithRelations[]
  const openInternships = (internshipsResult.success ? internshipsResult.data : []) as InternshipWithCount[]
  
  const stats = {
    total: applications.length,
    reviewing: applications.filter(app => app.status === 'REVIEWING').length,
    accepted: applications.filter(app => app.status === 'ACCEPTED').length,
    pending: applications.filter(app => app.status === 'PENDING').length,
  }
  
  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your applications and discover opportunities
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.reviewing}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.accepted}</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Action Button */}
        <Link href="/internships">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Internships
          </Button>
        </Link>
      </div>
        
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.reviewing}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.accepted}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* My Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Applications</h2>
          <Link href="/dashboard/applications">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {applications.length === 0 ? (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No applications yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Start your journey by applying to open internships</p>
              <Link href="/internships">
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore Opportunities
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.slice(0, 3).map((application) => (
                <div key={application.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                            {application.internship.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              {application.internship.department}
                            </span>
                            {application.internship.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {application.internship.location}
                              </span>
                            )}
                            {application.internship.duration && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {application.internship.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className={statusColors[application.status]}>
                          {statusLabels[application.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Applied {new Date(application.appliedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <Link href={`/internship/${application.internship.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            View Details
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Open Internships Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recommended for You</h2>
          <Link href="/internships">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {openInternships.slice(0, 4).map((internship) => {
            const hasApplied = applications.some(app => app.internshipId === internship.id)
            
            return (
              <Card key={internship.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {internship.title}
                        </h3>
                        {hasApplied && (
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px] shrink-0">
                            Applied
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {internship.department}
                        </span>
                        {internship.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {internship.location}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                        {internship.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/internship/${internship.id}`} className="flex-1">
                          <Button variant="outline" className="w-full h-8 text-xs border-slate-200 dark:border-slate-700">
                            Learn More
                          </Button>
                        </Link>
                        {!hasApplied && (
                          <Link href={`/apply/${internship.id}`} className="flex-1">
                            <Button className="w-full h-8 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                              Apply Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

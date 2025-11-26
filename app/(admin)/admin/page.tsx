import { getAllApplications } from '@/app/actions/applications'
import { getOpenInternships } from '@/app/actions/internships'
import { getAllLearningPaths } from '@/app/actions/learning'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Briefcase, 
  FileText, 
  Clock, 
  Target,
  GraduationCap,
  ChevronRight,
  Plus,
  Eye,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [applicationsResult, internshipsResult, learningPathsResult, usersCount, acceptedApplicationsCount] = await Promise.all([
    getAllApplications(),
    getOpenInternships(),
    getAllLearningPaths(),
    prisma.user.count(),
    prisma.application.count({ where: { status: 'ACCEPTED' } })
  ])
  
  const applications = applicationsResult.success ? applicationsResult.data ?? [] : []
  const internships = internshipsResult.success ? internshipsResult.data ?? [] : []
  const learningPaths = learningPathsResult.success ? learningPathsResult.data ?? [] : []
  
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter((app: any) => app.status === 'PENDING').length,
    reviewing: applications.filter((app: any) => app.status === 'REVIEWING').length,
    accepted: applications.filter((app: any) => app.status === 'ACCEPTED').length,
    rejected: applications.filter((app: any) => app.status === 'REJECTED').length,
    openInternships: internships.length,
    totalUsers: usersCount,
    totalInterns: acceptedApplicationsCount,
    learningPaths: learningPaths.length
  }
  
  const acceptanceRate = stats.totalApplications > 0 
    ? Math.round((stats.accepted / stats.totalApplications) * 100) 
    : 0

  const recentApplications = applications.slice(0, 5)
  
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Welcome Section - Left Aligned */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-base">
            Welcome back! Here's what's happening with your internship program.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild className="shadow-sm">
            <Link href="/admin/applications">
              <Eye className="mr-2 h-4 w-4" />
              View Applications
            </Link>
          </Button>
          <Button asChild className="shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/admin/internships/new">
              <Plus className="mr-2 h-4 w-4" />
              New Internship
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <div className="rounded-full bg-blue-500/10 p-2">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </span>
              from last month
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <div className="rounded-full bg-amber-500/10 p-2">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-amber-500 font-medium">Needs attention</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <div className="rounded-full bg-green-500/10 p-2">
              <Target className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptanceRate}%</div>
            <Progress value={acceptanceRate} className="mt-2 h-1.5" />
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
            <div className="rounded-full bg-purple-500/10 p-2">
              <GraduationCap className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterns}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              Currently enrolled
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Applications */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidate submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/applications" className="gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((application: any) => (
                  <div key={application.id} className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <Avatar className="h-10 w-10 border-2 border-background shadow">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                        {application.user.firstName?.[0]}{application.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {application.user.firstName} {application.user.lastName}
                        </p>
                        <Badge variant="secondary" className={
                          application.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' 
                          : application.status === 'REVIEWING' ? 'bg-blue-500/10 text-blue-500' 
                          : application.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' 
                          : 'bg-red-500/10 text-red-500'
                        }>
                          {application.status.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{application.internship.title}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/applications/${application.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
            <CardDescription>Program statistics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm flex-1">Pending</span>
                <span className="text-sm font-medium">{stats.pending}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm flex-1">Reviewing</span>
                <span className="text-sm font-medium">{stats.reviewing}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm flex-1">Accepted</span>
                <span className="text-sm font-medium">{stats.accepted}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm flex-1">Rejected</span>
                <span className="text-sm font-medium">{stats.rejected}</span>
              </div>
            </div>
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.openInternships}</p>
                <p className="text-xs text-muted-foreground">Open Positions</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.learningPaths}</p>
                <p className="text-xs text-muted-foreground">Learning Paths</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/applications" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-blue-500/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Review Applications</h3>
                <p className="text-sm text-muted-foreground">{stats.pending} pending</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/internships" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-green-500/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-green-500/10 p-3">
                <Briefcase className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Manage Internships</h3>
                <p className="text-sm text-muted-foreground">{stats.openInternships} active</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/learning-paths" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-purple-500/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <GraduationCap className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Learning Paths</h3>
                <p className="text-sm text-muted-foreground">{stats.learningPaths} paths</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

import { getUserApplications } from '@/app/actions/applications';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Calendar, 
  MapPin, 
  Building2,
  FileText,
  Briefcase,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { ApplicationStatus } from '@prisma/client';

export default async function MyApplicationsPage() {
  const result = await getUserApplications();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Failed to load your applications.</p>
        </div>
      </div>
    );
  }

  const applications = result.data;

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((app: { status: ApplicationStatus }) => app.status === 'PENDING').length,
    reviewing: applications.filter((app: { status: ApplicationStatus }) => app.status === 'REVIEWING').length,
    accepted: applications.filter((app: { status: ApplicationStatus }) => app.status === 'ACCEPTED').length,
    rejected: applications.filter((app: { status: ApplicationStatus }) => app.status === 'REJECTED').length,
  };

  // Status configuration
  const statusConfig = {
    PENDING: {
      label: 'Pending',
      icon: Clock,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
    REVIEWING: {
      label: 'Under Review',
      icon: Eye,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    ACCEPTED: {
      label: 'Accepted',
      icon: CheckCircle2,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    REJECTED: {
      label: 'Rejected',
      icon: XCircle,
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Applications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track the status of your internship applications
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{stats.pending}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
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
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Internships
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
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
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.reviewing}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reviewing</p>
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
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No applications yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Start your journey by applying to open internships</p>
            <Link href="/internships">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Explore Opportunities
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((application: any) => {
              const config = statusConfig[application.status as ApplicationStatus];
              const StatusIcon = config.icon;

              return (
                <div key={application.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {application.internship.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
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
                        <Badge variant="outline" className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      
                      {/* Application Details */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          Applied {new Date(application.appliedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {application.reviewedAt && (
                          <span>
                            Reviewed {new Date(application.reviewedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        )}
                      </div>

                      {/* Documents & Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {application.resumeUrl && (
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Resume
                          </a>
                        )}
                        {application.linkedinUrl && (
                          <a
                            href={application.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            LinkedIn
                          </a>
                        )}
                        {application.githubUrl && (
                          <a
                            href={application.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            GitHub
                          </a>
                        )}
                        {application.portfolioUrl && (
                          <a
                            href={application.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Portfolio
                          </a>
                        )}
                        
                        <div className="flex-1" />
                        
                        <Link href={`/internship/${application.internship.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            View Details
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                        {application.status === 'ACCEPTED' && (
                          <Link href="/dashboard/learning">
                            <Button size="sm" className="h-7 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                              Start Learning
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

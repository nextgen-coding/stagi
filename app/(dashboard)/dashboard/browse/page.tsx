import { getOpenInternships } from '@/app/actions/internships';
import { getUserApplications } from '@/app/actions/applications';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Briefcase, 
  CheckCircle2,
  Search,
  ArrowRight,
  Building2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default async function BrowsePositionsPage() {
  const [internshipsResult, applicationsResult] = await Promise.all([
    getOpenInternships(),
    getUserApplications()
  ]);

  if (!internshipsResult.success || !internshipsResult.data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Failed to load internships.</p>
        </div>
      </div>
    );
  }

  const internships = internshipsResult.data;
  const appliedInternshipIds = applicationsResult.success && applicationsResult.data
    ? new Set(applicationsResult.data.map((app: any) => app.internshipId))
    : new Set();

  const stats = {
    total: internships.length,
    applied: appliedInternshipIds.size,
    remote: internships.filter((int: any) => int.location?.toLowerCase().includes('remote')).length,
    paid: internships.filter((int: any) => int.isPaid).length,
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Browse Internships
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore and apply to available opportunities
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Briefcase className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.applied}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.remote}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <DollarSign className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{stats.paid}</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Action Button */}
        <Link href="/dashboard/applications">
          <Button variant="outline" className="border-slate-200 dark:border-slate-700">
            View My Applications
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Briefcase className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Open Positions</p>
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
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.applied}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">You Applied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.remote}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Remote</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.paid}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Internship Listings */}
      {internships.length === 0 ? (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No internships available</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Check back soon for new opportunities!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {internships.map((internship: any) => {
            const hasApplied = appliedInternshipIds.has(internship.id);
            
            return (
              <Card key={internship.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all flex flex-col">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                          {internship.title}
                        </h3>
                        {hasApplied && (
                          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] shrink-0">
                            Applied
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {internship.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{internship.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Starts {new Date(internship.startDate).toLocaleDateString()}</span>
                    </div>
                    {internship.isPaid && internship.salary && (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>{internship.salary}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/internship/${internship.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-8 text-xs border-slate-200 dark:border-slate-700">
                        View Details
                      </Button>
                    </Link>
                    {!hasApplied && (
                      <Link href={`/apply/${internship.id}`} className="flex-1">
                        <Button className="w-full h-8 text-xs bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          Apply Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

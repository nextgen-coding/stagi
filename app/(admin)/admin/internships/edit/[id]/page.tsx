import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Briefcase, AlertCircle, Settings2 } from 'lucide-react'
import { getInternshipById } from '@/app/actions/internships'
import { getActiveDepartments, getAllSkills } from '@/app/actions/settings'
import { EditInternshipForm } from '@/components/admin/edit-internship-form'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditInternshipPage({ params }: PageProps) {
  const { id } = await params
  
  // Fetch internship, departments, and skills in parallel
  const [internshipResult, departmentsResult, skillsResult] = await Promise.all([
    getInternshipById(id),
    getActiveDepartments(),
    getAllSkills()
  ])
  
  if (!internshipResult.success || !internshipResult.data) {
    return (
      <div className="p-6 lg:p-8">
        <Link href="/admin/internships">
          <Button variant="ghost" className="mb-4 gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Back to Internships
          </Button>
        </Link>
        <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Internship not found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">The internship you're looking for doesn't exist or has been removed.</p>
            <Link href="/admin/internships">
              <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Internships
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const internship = internshipResult.data
  const departments = departmentsResult.success ? departmentsResult.data || [] : []
  const skills = skillsResult.success ? skillsResult.data || [] : []
  
  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/internships">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Internship</h1>
            <Badge 
              variant="outline"
              className={`text-xs px-2.5 py-0.5 font-medium ${internship.isOpen 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50'
              }`}
            >
              {internship.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-0.5 truncate">{internship.title}</p>
        </div>
        <Link href={`/admin/internships/${internship.id}/apply-settings`}>
          <Button 
            variant="outline" 
            size="default"
            className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Customize Application
          </Button>
        </Link>
      </div>
      
      {/* Form Component */}
      <EditInternshipForm 
        internship={internship} 
        departments={departments}
        skills={skills}
      />
    </div>
  )
}

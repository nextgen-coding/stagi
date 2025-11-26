import { getLearningPathById } from "@/app/actions/learning"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, Plus, Layers, CheckSquare, Clock, Pencil } from "lucide-react"
import { ModuleList } from "@/components/admin/module-list"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function LearningPathDetailPage({ params }: PageProps) {
  const { id } = await params
  const result = await getLearningPathById(id)
  
  if (!result.success || !result.data) {
    return (
      <div className="p-6 lg:p-8">
        <Link href="/admin/learning-paths">
          <Button variant="ghost" className="mb-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Button>
        </Link>
        <Card className="p-12 text-center bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-semibold">Learning path not found</p>
          </div>
          <Link href="/admin/learning-paths">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Paths
            </Button>
          </Link>
        </Card>
      </div>
    )
  }
  
  const learningPath = result.data
  const totalTasks = learningPath.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0)
  const totalHours = learningPath.modules.reduce((acc: number, m: any) => acc + (m.estimatedHours || 0), 0)
  
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Link href="/admin/learning-paths">
            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {learningPath.title}
              </h1>
              <Badge className={learningPath.isActive 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }>
                {learningPath.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {learningPath.description || 'No description provided'}
            </p>
          </div>
        </div>
        
        <Link href={`/admin/learning-paths/edit/${learningPath.id}`}>
          <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        </Link>
      </div>
      
      {/* Stats Row - Inline */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-600 dark:text-slate-400">Modules:</span>
          <span className="font-semibold text-blue-700 dark:text-blue-300">{learningPath.modules.length}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
          <CheckSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-slate-600 dark:text-slate-400">Tasks:</span>
          <span className="font-semibold text-cyan-700 dark:text-cyan-300">{totalTasks}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-600 dark:text-slate-400">Duration:</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
            {learningPath.estimatedDays ? `${learningPath.estimatedDays} days` : totalHours ? `${totalHours}h` : 'N/A'}
          </span>
        </div>
      </div>
      
      {/* Modules Section */}
      <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Modules & Tasks
            </CardTitle>
            <Link href={`/admin/learning-paths/${learningPath.id}/modules/new`}>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Add Module
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ModuleList learningPathId={learningPath.id} modules={learningPath.modules} />
        </CardContent>
      </Card>
    </div>
  )
}

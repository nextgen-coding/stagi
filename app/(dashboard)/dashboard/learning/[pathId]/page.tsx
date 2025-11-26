import { getMyLearningProgress, getTaskById } from '@/app/actions/learning'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  ArrowLeft,
  BookOpen, 
  CheckCircle, 
  Clock, 
  Layers,
  Play,
  CheckSquare,
  Circle,
  GraduationCap,
  Trophy,
  Target
} from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { LearningPathContent } from '@/components/learning-path-content'

type PageProps = {
  params: Promise<{ pathId: string }>
}

export default async function LearningPathPage({ params }: PageProps) {
  const { pathId } = await params
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  const result = await getMyLearningProgress()
  
  if (!result.success) {
    redirect('/dashboard/learning')
  }
  
  // Find the specific learning path progress
  const progress = result.data?.find((p: any) => p.learningPathId === pathId)
  
  if (!progress) {
    notFound()
  }
  
  const learningPath = progress.learningPath
  
  // Calculate stats
  const totalTasks = learningPath.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0)
  const completedTasks = learningPath.modules.reduce((acc: number, m: any) => 
    acc + m.tasks.filter((t: any) => t.taskProgress[0]?.isCompleted).length, 0)
  const isCompleted = progress.progressPercent === 100

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/learning">
          <Button variant="ghost" size="sm" className="w-fit text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Learning
          </Button>
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl shadow-lg ${
              isCompleted 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {isCompleted ? (
                <Trophy className="h-7 w-7 text-white" />
              ) : (
                <GraduationCap className="h-7 w-7 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {learningPath.title}
                </h1>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                {learningPath.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
              <Layers className="w-3 h-3 mr-1" />
              {learningPath.modules.length} Modules
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
              <Target className="w-3 h-3 mr-1" />
              {totalTasks} Tasks
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {completedTasks} Done
            </Badge>
            {learningPath.estimatedDays && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                <Clock className="w-3 h-3 mr-1" />
                {learningPath.estimatedDays} Days
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{progress.progressPercent}%</span>
              </div>
              <Progress 
                value={progress.progressPercent} 
                className={`h-3 ${isCompleted ? '[&>div]:bg-green-500' : ''}`}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="text-center">
                <p className={`text-3xl font-bold ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {progress.progressPercent}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Complete</p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {learningPath.modules.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Modules</p>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {totalTasks - completedTasks}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Remaining</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Content */}
      <LearningPathContent 
        learningPath={learningPath}
        progressId={progress.id}
      />
    </div>
  )
}

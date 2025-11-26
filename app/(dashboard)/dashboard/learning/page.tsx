import { getMyLearningProgress } from '@/app/actions/learning'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Layers,
  ChevronRight,
  Play,
  Trophy,
  GraduationCap,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function LearningDashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  const result = await getMyLearningProgress()
  const progressData = result.success ? result.data : []

  // Calculate overall stats
  const totalModules = progressData.reduce((acc: number, p: any) => 
    acc + p.learningPath.modules.length, 0)
  
  const totalTasks = progressData.reduce((acc: number, p: any) => 
    acc + p.learningPath.modules.reduce((mAcc: number, m: any) => mAcc + m.tasks.length, 0), 0)
  
  const completedTasks = progressData.reduce((acc: number, p: any) => 
    acc + p.learningPath.modules.reduce((mAcc: number, m: any) => 
      mAcc + m.tasks.filter((t: any) => t.taskProgress[0]?.isCompleted).length, 0), 0)
  
  const avgProgress = progressData.length > 0
    ? Math.round(progressData.reduce((acc: number, p: any) => acc + p.progressPercent, 0) / progressData.length)
    : 0

  const inProgressPaths = progressData.filter((p: any) => p.progressPercent > 0 && p.progressPercent < 100).length
  const completedPaths = progressData.filter((p: any) => p.progressPercent === 100).length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Learning
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your progress and continue learning
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            <BookOpen className="w-3 h-3 mr-1" />
            {progressData.length} Paths
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
            <Layers className="w-3 h-3 mr-1" />
            {totalModules} Modules
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {completedTasks}/{totalTasks} Tasks
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
            <Trophy className="w-3 h-3 mr-1" />
            {avgProgress}% Complete
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progressData.length}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Learning Paths</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/50 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{inProgressPaths}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-green-50 to-white dark:from-green-950/50 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedPaths}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/50 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgProgress}%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Learning Paths</h2>
          {progressData.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {progressData.length} path{progressData.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {progressData.length === 0 ? (
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <GraduationCap className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No learning paths assigned yet
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm mb-6">
                Once your application is accepted, you&apos;ll see your learning path here. Start by browsing available internships.
              </p>
              <Link href="/dashboard/browse">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse Internships
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {progressData.map((progress: any) => {
              const learningPath = progress.learningPath
              const totalPathTasks = learningPath.modules.reduce((acc: number, m: any) => acc + m.tasks.length, 0)
              const completedPathTasks = learningPath.modules.reduce((acc: number, m: any) => 
                acc + m.tasks.filter((t: any) => t.taskProgress[0]?.isCompleted).length, 0)
              
              // Find current module (first module with incomplete tasks)
              const currentModule = learningPath.modules.find((m: any) => 
                m.tasks.some((t: any) => !t.taskProgress[0]?.isCompleted)
              ) || learningPath.modules[learningPath.modules.length - 1]
              
              // Find next incomplete task
              const nextTask = currentModule?.tasks.find((t: any) => !t.taskProgress[0]?.isCompleted)

              const isCompleted = progress.progressPercent === 100
              const isNotStarted = progress.progressPercent === 0

              return (
                <Card 
                  key={progress.id} 
                  className={`border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-200 ${
                    isCompleted ? 'ring-2 ring-green-500/20 dark:ring-green-400/20' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Left: Icon & Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}>
                          {isCompleted ? (
                            <Trophy className="h-6 w-6 text-white" />
                          ) : (
                            <BookOpen className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                              {learningPath.title}
                            </h3>
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {!isCompleted && !isNotStarted && (
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-3">
                            {learningPath.description}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 dark:text-slate-400">
                                {completedPathTasks} of {totalPathTasks} tasks completed
                              </span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {progress.progressPercent}%
                              </span>
                            </div>
                            <Progress 
                              value={progress.progressPercent} 
                              className={`h-2 ${isCompleted ? '[&>div]:bg-green-500' : ''}`} 
                            />
                          </div>

                          {/* Stats Row */}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {learningPath.modules.length} modules
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {completedPathTasks}/{totalPathTasks} tasks
                            </span>
                            {learningPath.estimatedDays && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {learningPath.estimatedDays} days estimated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Action Area */}
                      <div className="flex flex-col items-end gap-3 lg:min-w-[180px]">
                        {/* Up Next Card */}
                        {currentModule && nextTask && !isCompleted && (
                          <div className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-medium">Up Next</p>
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                              {nextTask.title}
                            </p>
                          </div>
                        )}
                        
                        <Link href={`/dashboard/learning/${progress.learningPathId}`} className="w-full lg:w-auto">
                          <Button 
                            className={`w-full ${
                              isCompleted 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            } text-white`}
                          >
                            {isNotStarted ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start Learning
                              </>
                            ) : isCompleted ? (
                              <>
                                <Trophy className="w-4 h-4 mr-2" />
                                View Certificate
                              </>
                            ) : (
                              <>
                                Continue Learning
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

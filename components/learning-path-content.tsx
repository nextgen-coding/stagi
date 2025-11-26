'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Clock, 
  Circle,
  ChevronDown,
  ChevronUp,
  Play,
  Loader2,
  Send,
  Github,
  Link as LinkIcon,
  Upload,
  Image,
  Code,
  MessageSquare,
  CheckSquare
} from 'lucide-react'
import { completeTask, submitTask } from '@/app/actions/learning'
import { TaskContentViewer, type TaskContentItem } from '@/components/task-content-viewer'

const submissionTypeLabels: Record<string, { label: string; icon: any; placeholder: string }> = {
  TEXT_INPUT: { label: 'Text Response', icon: MessageSquare, placeholder: 'Enter your answer...' },
  GITHUB_REPO: { label: 'GitHub Repository', icon: Github, placeholder: 'https://github.com/username/repo' },
  URL_LINK: { label: 'URL Link', icon: LinkIcon, placeholder: 'https://...' },
  FILE_UPLOAD: { label: 'File/ZIP Upload', icon: Upload, placeholder: 'Upload your file (PDF, ZIP, etc.)' },
  IMAGE_UPLOAD: { label: 'Image Upload', icon: Image, placeholder: 'Upload your screenshot' },
  CODE_SNIPPET: { label: 'Code Snippet', icon: Code, placeholder: 'Paste your code here...' }
}

interface SubmissionRequirement {
  id: string
  submissionType: string
  instructions?: string | null
  isRequired: boolean
}

interface TaskSubmission {
  id: string
  content: string
  status: string
  feedback?: string | null
}

interface Task {
  id: string
  title: string
  description: string
  isRequired: boolean
  estimatedMinutes: number | null
  orderIndex: number
  contents?: TaskContentItem[]
  submissionRequirement?: SubmissionRequirement | null
  submissions?: TaskSubmission[]
  taskProgress: Array<{
    isCompleted: boolean
    completedAt?: string | null
    notes?: string | null
  }>
}

interface Module {
  id: string
  title: string
  description: string
  orderIndex: number
  estimatedHours: number | null
  tasks: Task[]
}

interface LearningPathContentProps {
  learningPath: {
    id: string
    title: string
    modules: Module[]
  }
  progressId: string
}

export function LearningPathContent({ learningPath, progressId }: LearningPathContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(learningPath.modules.map(m => m.id))
  )
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null)
  const [submissionContent, setSubmissionContent] = useState<string>('')

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTaskId(taskId)
    startTransition(async () => {
      const result = await completeTask(taskId)
      if (result.success) {
        router.refresh()
      }
      setCompletingTaskId(null)
    })
  }

  const handleSubmitTask = async (taskId: string) => {
    if (!submissionContent.trim()) return
    
    setSubmittingTaskId(taskId)
    startTransition(async () => {
      const result = await submitTask({
        taskId,
        content: submissionContent.trim()
      })
      if (result.success) {
        setSubmissionContent('')
        router.refresh()
      }
      setSubmittingTaskId(null)
    })
  }

  const getActiveTask = () => {
    if (!activeTaskId) return null
    for (const module of learningPath.modules) {
      const task = module.tasks.find(t => t.id === activeTaskId)
      if (task) return { task, module }
    }
    return null
  }

  const activeTaskData = getActiveTask()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Module List */}
      <div className="lg:col-span-1 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Course Content</h2>
        
        {learningPath.modules
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(module.id)
            const completedTasks = module.tasks.filter(t => t.taskProgress[0]?.isCompleted).length
            const totalTasks = module.tasks.length
            const isModuleComplete = completedTasks === totalTasks

            return (
              <Card key={module.id} className="overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                {/* Module Header */}
                <div 
                  className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    isModuleComplete ? 'bg-green-50 dark:bg-green-900/10' : ''
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Module {moduleIndex + 1}
                        </span>
                        {isModuleComplete && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {completedTasks}/{totalTasks} tasks completed
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Tasks */}
                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    {module.tasks
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((task) => {
                        const isCompleted = task.taskProgress[0]?.isCompleted
                        const isActive = activeTaskId === task.id
                        const hasSubmission = task.submissions && task.submissions.length > 0
                        const submissionStatus = task.submissions?.[0]?.status

                        return (
                          <div
                            key={task.id}
                            onClick={() => setActiveTaskId(task.id)}
                            className={`p-3 flex items-center gap-3 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 last:border-0 transition-colors ${
                              isActive 
                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-slate-100 dark:bg-slate-700'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                isCompleted 
                                  ? 'text-slate-500 dark:text-slate-400' 
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {task.submissionRequirement && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                    <Send className="w-2.5 h-2.5 mr-1" />
                                    {task.submissionRequirement.submissionType.replace('_', ' ')}
                                  </Badge>
                                )}
                                {hasSubmission && (
                                  <Badge variant="outline" className={`text-xs px-1.5 py-0 ${
                                    submissionStatus === 'APPROVED' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                    submissionStatus === 'REJECTED' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                    'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                  }`}>
                                    {submissionStatus === 'APPROVED' ? 'Approved' : 
                                     submissionStatus === 'REJECTED' ? 'Rejected' : 'Pending'}
                                  </Badge>
                                )}
                                {task.estimatedMinutes && (
                                  <span className="text-xs text-slate-400">
                                    {task.estimatedMinutes} min
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </Card>
            )
          })}
      </div>

      {/* Task Content View */}
      <div className="lg:col-span-2">
        {activeTaskData ? (
          <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            {/* Task Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    {activeTaskData.module.title}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activeTaskData.task.title}
                  </h2>
                </div>
                {activeTaskData.task.submissionRequirement && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    <Send className="w-3 h-3 mr-1" />
                    {activeTaskData.task.submissionRequirement.submissionType.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {activeTaskData.task.description}
              </p>
              {activeTaskData.task.estimatedMinutes && (
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  Estimated time: {activeTaskData.task.estimatedMinutes} minutes
                </div>
              )}
            </div>

            {/* Task Content */}
            <div className="mb-6">
              <TaskContentViewer contents={activeTaskData.task.contents || []} />
            </div>

            {/* Submission Section */}
            {activeTaskData.task.submissionRequirement && (
              <div className="mb-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Your Submission
                </h3>
                
                {activeTaskData.task.submissionRequirement.instructions && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {activeTaskData.task.submissionRequirement.instructions}
                    </p>
                  </div>
                )}

                {/* Existing Submission */}
                {activeTaskData.task.submissions && activeTaskData.task.submissions.length > 0 ? (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg border ${
                      activeTaskData.task.submissions[0].status === 'APPROVED' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : activeTaskData.task.submissions[0].status === 'REJECTED'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 dark:text-white">Your Submission</span>
                        <Badge className={
                          activeTaskData.task.submissions[0].status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : activeTaskData.task.submissions[0].status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }>
                          {activeTaskData.task.submissions[0].status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                        {activeTaskData.task.submissions[0].content}
                      </p>
                      {activeTaskData.task.submissions[0].feedback && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                          <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Admin Feedback:</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {activeTaskData.task.submissions[0].feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Allow resubmission if rejected */}
                    {activeTaskData.task.submissions[0].status === 'REJECTED' && (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Submit again:</p>
                        <textarea
                          value={submissionContent}
                          onChange={(e) => setSubmissionContent(e.target.value)}
                          placeholder={submissionTypeLabels[activeTaskData.task.submissionRequirement.submissionType]?.placeholder || 'Enter your submission...'}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                          disabled={isPending}
                        />
                        <Button
                          onClick={() => handleSubmitTask(activeTaskData.task.id)}
                          disabled={isPending || submittingTaskId === activeTaskData.task.id || !submissionContent.trim()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {submittingTaskId === activeTaskData.task.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Resubmit
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* New Submission Form */
                  <div className="space-y-3">
                    {activeTaskData.task.submissionRequirement.submissionType === 'CODE_SNIPPET' ? (
                      <textarea
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        placeholder="Paste your code here..."
                        rows={8}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-900 font-mono text-sm text-green-400 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        disabled={isPending}
                      />
                    ) : activeTaskData.task.submissionRequirement.submissionType === 'TEXT_INPUT' ? (
                      <textarea
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        placeholder="Enter your answer..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        disabled={isPending}
                      />
                    ) : (
                      <input
                        type="text"
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        placeholder={submissionTypeLabels[activeTaskData.task.submissionRequirement.submissionType]?.placeholder || 'Enter your submission...'}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isPending}
                      />
                    )}
                    <Button
                      onClick={() => handleSubmitTask(activeTaskData.task.id)}
                      disabled={isPending || submittingTaskId === activeTaskData.task.id || !submissionContent.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {submittingTaskId === activeTaskData.task.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Complete Button */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              {activeTaskData.task.taskProgress[0]?.isCompleted ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Completed</span>
                </div>
              ) : activeTaskData.task.submissionRequirement?.isRequired && 
                   (!activeTaskData.task.submissions || activeTaskData.task.submissions.length === 0 || 
                    activeTaskData.task.submissions[0].status !== 'APPROVED') ? (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <Send className="w-5 h-5" />
                  <span className="font-medium">
                    {activeTaskData.task.submissions && activeTaskData.task.submissions.length > 0
                      ? 'Awaiting submission approval'
                      : 'Submit your work to complete this task'}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => handleCompleteTask(activeTaskData.task.id)}
                  disabled={isPending || completingTaskId === activeTaskData.task.id}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {completingTaskId === activeTaskData.task.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Marking Complete...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Select a task to begin
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a task from the module list to view its content
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

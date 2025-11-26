'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Layers, 
  CheckSquare, 
  Clock, 
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Send
} from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteModule, deleteTask } from '@/app/actions/learning'

type TaskContent = {
  id: string
  contentType: string
  orderIndex: number
}

type SubmissionRequirement = {
  id: string
  submissionType: string
  instructions?: string | null
  isRequired: boolean
}

type Module = {
  id: string
  title: string
  description: string
  orderIndex: number
  estimatedHours: number | null
  tasks: Task[]
}

type Task = {
  id: string
  title: string
  description: string
  isRequired: boolean
  estimatedMinutes: number | null
  orderIndex: number
  contents?: TaskContent[]
  submissionRequirement?: SubmissionRequirement | null
}

type ModuleListProps = {
  learningPathId: string
  modules: Module[]
}

export function ModuleList({ learningPathId, modules }: ModuleListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)))

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleDeleteModule = (module: Module) => {
    if (module.tasks.length > 0) {
      alert('Please delete all tasks in this module first.')
      return
    }

    const confirmed = confirm(`Are you sure you want to delete "${module.title}"?`)
    
    if (confirmed) {
      startTransition(async () => {
        const result = await deleteModule(module.id)
        
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || 'Failed to delete module')
        }
      })
    }
  }

  const handleDeleteTask = (task: Task) => {
    const confirmed = confirm(`Are you sure you want to delete "${task.title}"?`)
    
    if (confirmed) {
      startTransition(async () => {
        const result = await deleteTask(task.id)
        
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || 'Failed to delete task')
        }
      })
    }
  }

  if (modules.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
            <Layers className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              No modules yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Add your first module to structure this learning path
            </p>
            <Link href={`/admin/learning-paths/${learningPathId}/modules/new`}>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Add Module
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {modules
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((module, index) => {
          const isExpanded = expandedModules.has(module.id)
          
          return (
            <Card key={module.id} className="overflow-hidden bg-transparent border-0 rounded-none shadow-none">
              {/* Module Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0 mt-0.5">
                      <Layers className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Module {index + 1}</span>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-1.5 line-clamp-1">
                        {module.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-blue-500" />
                          <span>{module.tasks.length} {module.tasks.length === 1 ? 'task' : 'tasks'}</span>
                        </div>
                        {module.estimatedHours && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-500" />
                            <span>{module.estimatedHours}h</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-emerald-500" />
                          <span>{module.tasks.filter(t => t.isRequired).length} required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/admin/learning-paths/${learningPathId}/modules/${module.id}/tasks/new`)
                      }}
                      disabled={isPending}
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-8 px-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      <span className="text-xs">Task</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Edit module functionality
                      }}
                      disabled={isPending}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 h-8 w-8 p-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteModule(module)
                      }}
                      disabled={isPending || module.tasks.length > 0}
                      className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 dark:text-slate-500 h-8 w-8 p-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Tasks List */}
              {isExpanded && module.tasks.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4">
                  <div className="space-y-2">
                    {module.tasks
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((task, taskIndex) => {
                        return (
                          <div key={task.id} className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5 flex-1">
                                <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded flex-shrink-0 mt-0.5">
                                  <CheckSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                      {index + 1}.{taskIndex + 1}
                                    </span>
                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                      {task.title}
                                    </h4>
                                    {task.isRequired && (
                                      <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 text-[10px] px-1.5 py-0">
                                        Required
                                      </Badge>
                                    )}
                                    {task.contents && task.contents.length > 0 && (
                                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] px-1.5 py-0">
                                        {task.contents.length} content
                                      </Badge>
                                    )}
                                    {task.submissionRequirement && (
                                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px] px-1.5 py-0">
                                        <Send className="w-2.5 h-2.5 mr-0.5" />
                                        {task.submissionRequirement.submissionType.replace('_', ' ')}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                    {task.description}
                                  </p>
                                  {task.estimatedMinutes && (
                                    <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 mt-1">
                                      <Clock className="w-3 h-3" />
                                      {task.estimatedMinutes} min
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    router.push(`/admin/learning-paths/${learningPathId}/modules/${module.id}/tasks/${task.id}/edit`)
                                  }}
                                  disabled={isPending}
                                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 h-7 w-7 p-0"
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task)}
                                  disabled={isPending}
                                  className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 h-7 w-7 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
    </div>
  )
}

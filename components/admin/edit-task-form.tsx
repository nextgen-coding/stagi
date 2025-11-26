'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CheckSquare, 
  Loader2,
  Github,
  Link as LinkIcon,
  Upload,
  Image,
  Code,
  MessageSquare,
  X,
  Save,
  Clock,
  FileText
} from 'lucide-react'
import { updateTaskWithContents } from '@/app/actions/learning'
import { TaskContentEditor, type TaskContentBlock, type TaskContentType } from '@/components/admin/task-content-editor'

const submissionTypes = [
  { value: 'NONE', label: 'None', icon: X, color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400', description: 'No submission required' },
  { value: 'TEXT_INPUT', label: 'Text', icon: MessageSquare, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', description: 'Written response' },
  { value: 'GITHUB_REPO', label: 'GitHub', icon: Github, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', description: 'Repository link' },
  { value: 'URL_LINK', label: 'URL', icon: LinkIcon, color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400', description: 'Website link' },
  { value: 'FILE_UPLOAD', label: 'File', icon: Upload, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', description: 'Upload document' },
  { value: 'IMAGE_UPLOAD', label: 'Image', icon: Image, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400', description: 'Upload image' },
  { value: 'CODE_SNIPPET', label: 'Code', icon: Code, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', description: 'Code snippet' }
]

interface TaskData {
  id: string
  title: string
  description: string
  isRequired: boolean
  estimatedMinutes: number | null
  contents: Array<{
    id: string
    contentType: string
    orderIndex: number
    textContent?: string | null
    videoUrl?: string | null
    fileUrl?: string | null
    fileName?: string | null
    linkUrl?: string | null
    linkTitle?: string | null
  }>
  submissionRequirement?: {
    id: string
    submissionType: string
    instructions?: string | null
    isRequired: boolean
  } | null
  module: {
    id: string
    title: string
    learningPath: {
      id: string
      title: string
    }
  }
}

interface EditTaskFormProps {
  learningPathId: string
  learningPathTitle: string
  moduleId: string
  moduleTitle: string
  task: TaskData
}

export function EditTaskForm({ learningPathId, learningPathTitle, moduleId, moduleTitle, task }: EditTaskFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    isRequired: task.isRequired,
    estimatedMinutes: task.estimatedMinutes?.toString() || ''
  })
  
  const [submission, setSubmission] = useState({
    type: task.submissionRequirement?.submissionType || 'NONE',
    instructions: task.submissionRequirement?.instructions || '',
    isRequired: task.submissionRequirement?.isRequired ?? true
  })
  
  const [contents, setContents] = useState<TaskContentBlock[]>(
    task.contents.map((c) => ({
      id: c.id,
      contentType: c.contentType as TaskContentType,
      orderIndex: c.orderIndex,
      textContent: c.textContent || undefined,
      videoUrl: c.videoUrl || undefined,
      fileUrl: c.fileUrl || undefined,
      fileName: c.fileName || undefined,
      linkUrl: c.linkUrl || undefined,
      linkTitle: c.linkTitle || undefined
    }))
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Task title is required')
      return
    }

    if (!formData.description.trim()) {
      setError('Task description is required')
      return
    }

    startTransition(async () => {
      const result = await updateTaskWithContents(task.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        isRequired: formData.isRequired,
        estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : null,
        contents: contents.map(c => ({
          contentType: c.contentType,
          orderIndex: c.orderIndex,
          textContent: c.textContent,
          videoUrl: c.videoUrl,
          fileUrl: c.fileUrl,
          fileName: c.fileName,
          linkUrl: c.linkUrl,
          linkTitle: c.linkTitle
        })),
        submission: submission.type !== 'NONE' ? {
          submissionType: submission.type,
          instructions: submission.instructions.trim() || undefined,
          isRequired: submission.isRequired
        } : null
      })

      if (result.success) {
        router.push(`/admin/learning-paths/${learningPathId}`)
        router.refresh()
      } else {
        setError(result.error || 'Failed to update task')
      }
    })
  }

  const selectedSubmissionType = submissionTypes.find(t => t.value === submission.type)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Link href={`/admin/learning-paths/${learningPathId}`}>
            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Task
              </h1>
              {formData.isRequired && (
                <Badge className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                  Required
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 dark:text-slate-500">{learningPathTitle}</span>
              <span className="mx-1.5">›</span>
              <span>{moduleTitle}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/admin/learning-paths/${learningPathId}`}>
            <Button variant="outline" size="sm" disabled={isPending} className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="edit-task-form"
            size="sm"
            disabled={isPending}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form id="edit-task-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content Card */}
        <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          {/* Task Details Section */}
          <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Task Details
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Required</span>
                <Switch
                  checked={formData.isRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
                  disabled={isPending}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Understanding React Components"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isPending}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Est. Time (min)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={formData.estimatedMinutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: e.target.value }))}
                    placeholder="30"
                    min="1"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief overview of what this task covers..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
                disabled={isPending}
              />
            </div>
          </CardContent>

          {/* Submission Requirements Section */}
          <CardHeader className="border-t border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Submission Requirement
              </CardTitle>
              {submission.type !== 'NONE' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Required</span>
                  <Switch
                    checked={submission.isRequired}
                    onCheckedChange={(checked) => setSubmission(prev => ({ ...prev, isRequired: checked }))}
                    disabled={isPending}
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Submission Type Selection - Compact Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {submissionTypes.map((type) => {
                const Icon = type.icon
                const isSelected = submission.type === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSubmission(prev => ({ ...prev, type: type.value }))}
                    disabled={isPending}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded ${type.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {selectedSubmissionType && selectedSubmissionType.value !== 'NONE' && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Submission Instructions
                </label>
                <textarea
                  value={submission.instructions}
                  onChange={(e) => setSubmission(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder={`Describe what the intern needs to submit...`}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm"
                  disabled={isPending}
                />
              </div>
            )}
          </CardContent>

          {/* Task Content Section */}
          <CardHeader className="border-t border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Learning Content
              {contents.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                  {contents.length} item{contents.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <TaskContentEditor
              contents={contents}
              onChange={setContents}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

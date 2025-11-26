'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  X
} from 'lucide-react'
import { createTaskWithContents } from '@/app/actions/learning'
import { TaskContentEditor, type TaskContentBlock } from '@/components/admin/task-content-editor'

const submissionTypes = [
  { value: 'NONE', label: 'No Submission', icon: X, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', description: 'Reading/watching only' },
  { value: 'TEXT_INPUT', label: 'Text Response', icon: MessageSquare, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', description: 'Written answer or explanation' },
  { value: 'GITHUB_REPO', label: 'GitHub Repo', icon: Github, color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300', description: 'Link to a GitHub repository' },
  { value: 'URL_LINK', label: 'URL Link', icon: LinkIcon, color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300', description: 'Any website or resource link' },
  { value: 'FILE_UPLOAD', label: 'File/ZIP Upload', icon: Upload, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', description: 'Upload PDF, ZIP, or document' },
  { value: 'IMAGE_UPLOAD', label: 'Image Upload', icon: Image, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300', description: 'Upload screenshot or image' },
  { value: 'CODE_SNIPPET', label: 'Code Snippet', icon: Code, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', description: 'Paste code solution' }
]

interface NewTaskFormProps {
  learningPathId: string
  learningPathTitle: string
  moduleId: string
  moduleTitle: string
}

export function NewTaskForm({ learningPathId, learningPathTitle, moduleId, moduleTitle }: NewTaskFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isRequired: true,
    estimatedMinutes: ''
  })
  
  const [submission, setSubmission] = useState({
    type: 'NONE',
    instructions: '',
    isRequired: true
  })
  
  const [contents, setContents] = useState<TaskContentBlock[]>([])

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
      const result = await createTaskWithContents({
        moduleId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        isRequired: formData.isRequired,
        estimatedMinutes: formData.estimatedMinutes ? parseInt(formData.estimatedMinutes) : undefined,
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
        } : undefined
      })

      if (result.success) {
        router.push(`/admin/learning-paths/${learningPathId}`)
        router.refresh()
      } else {
        setError(result.error || 'Failed to create task')
      }
    })
  }

  const selectedSubmissionType = submissionTypes.find(t => t.value === submission.type)

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link href={`/admin/learning-paths/${learningPathId}`}>
          <Button variant="ghost" className="mb-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {learningPathTitle}
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <CheckSquare className="w-6 h-6 text-purple-700 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Add New Task
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create a new task in <span className="font-medium">{moduleTitle}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Basic Info Card */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Task Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Understanding React Components"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief overview of what this task covers..."
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: e.target.value }))}
                  placeholder="e.g., 30"
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isPending}
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={formData.isRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  disabled={isPending}
                />
                <label htmlFor="isRequired" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Required task (must complete to progress)
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Submission Requirements Card */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Submission Requirement
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Define what the intern needs to submit for this task
          </p>
          
          <div className="space-y-4">
            {/* Submission Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {submissionTypes.map((type) => {
                const Icon = type.icon
                const isSelected = submission.type === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSubmission(prev => ({ ...prev, type: type.value }))}
                    disabled={isPending}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {selectedSubmissionType && selectedSubmissionType.value !== 'NONE' && (
              <>
                {/* Selected Type Info */}
                <div className={`p-3 rounded-lg ${selectedSubmissionType.color} border`}>
                  <div className="flex items-center gap-2">
                    <selectedSubmissionType.icon className="w-4 h-4" />
                    <span className="font-medium">{selectedSubmissionType.label}</span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">{selectedSubmissionType.description}</p>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Submission Instructions
                  </label>
                  <textarea
                    value={submission.instructions}
                    onChange={(e) => setSubmission(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder={`Tell the intern what they need to submit...\n\nExample: "Create a GitHub repository with your solution and paste the link here. Make sure to include a README with instructions."`}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    disabled={isPending}
                  />
                </div>

                {/* Required submission toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="submissionRequired"
                    checked={submission.isRequired}
                    onChange={(e) => setSubmission(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    disabled={isPending}
                  />
                  <label htmlFor="submissionRequired" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Submission required to mark task complete
                  </label>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Task Content Card */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Task Content
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Add the learning materials for this task. You can include text, videos, PDFs, images, and links.
          </p>
          <TaskContentEditor
            contents={contents}
            onChange={setContents}
          />
        </Card>

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 mr-2" />
                Create Task
              </>
            )}
          </Button>
          <Link href={`/admin/learning-paths/${learningPathId}`}>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

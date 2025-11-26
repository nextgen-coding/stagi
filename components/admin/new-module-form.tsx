'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Layers, Loader2 } from 'lucide-react'
import { createModule } from '@/app/actions/learning'

interface NewModuleFormProps {
  learningPathId: string
  learningPathTitle: string
}

export function NewModuleForm({ learningPathId, learningPathTitle }: NewModuleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedHours: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Module title is required')
      return
    }

    if (!formData.description.trim()) {
      setError('Module description is required')
      return
    }

    startTransition(async () => {
      const result = await createModule({
        learningPathId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined
      })

      if (result.success) {
        router.push(`/admin/learning-paths/${learningPathId}`)
        router.refresh()
      } else {
        setError(result.error || 'Failed to create module')
      }
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <Link href={`/admin/learning-paths/${learningPathId}`}>
          <Button variant="ghost" className="mb-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {learningPathTitle}
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
            <Layers className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Add New Module
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create a new module for {learningPathTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Module Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Introduction to React"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this module covers and what the intern will learn..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Estimated Hours
            </label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
              placeholder="e.g., 8"
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Approximate time to complete this module
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
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
                  <Layers className="w-4 h-4 mr-2" />
                  Create Module
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
      </Card>
    </div>
  )
}

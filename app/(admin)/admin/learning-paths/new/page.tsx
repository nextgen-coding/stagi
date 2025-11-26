'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react'
import { createLearningPath } from '@/app/actions/learning'

export default function NewLearningPathPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedDays: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Learning path title is required')
      return
    }

    if (!formData.description.trim()) {
      setError('Learning path description is required')
      return
    }

    startTransition(async () => {
      const result = await createLearningPath({
        title: formData.title.trim(),
        description: formData.description.trim(),
        estimatedDays: formData.estimatedDays ? parseInt(formData.estimatedDays) : undefined
      })

      if (result.success) {
        router.push(`/admin/learning-paths/${result.data.id}`)
        router.refresh()
      } else {
        setError(result.error || 'Failed to create learning path')
      }
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/admin/learning-paths">
          <Button variant="ghost" className="mb-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Paths
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Learning Path
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create a structured learning journey for interns
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
              Learning Path Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Frontend Development Fundamentals"
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
              placeholder="Describe what this learning path covers and what skills interns will gain..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Estimated Duration (days)
            </label>
            <input
              type="number"
              value={formData.estimatedDays}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: e.target.value }))}
              placeholder="e.g., 14"
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isPending}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Approximate time for interns to complete this path
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
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Learning Path
                </>
              )}
            </Button>
            <Link href="/admin/learning-paths">
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

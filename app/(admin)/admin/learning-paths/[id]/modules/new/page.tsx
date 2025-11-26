'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'
import { createModule } from '@/app/actions/learning'

type PageProps = {
  params: Promise<{ id: string }>
}

export default function NewModulePage({ params }: PageProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [learningPathId, setLearningPathId] = useState<string | null>(null)

  // Unwrap params
  useEffect(() => {
    params.then(p => setLearningPathId(p.id))
  }, [params])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!learningPathId) return
    
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      learningPathId,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      estimatedHours: formData.get('estimatedHours') ? parseInt(formData.get('estimatedHours') as string) : undefined
    }
    
    if (!data.title || !data.description) {
      setError('Please fill in all required fields')
      return
    }
    
    startTransition(async () => {
      const result = await createModule(data)
      
      if (result.success) {
        router.push(`/admin/learning-paths/${learningPathId}`)
        router.refresh()
      } else {
        setError(result.error || 'Failed to create module')
      }
    })
  }

  if (!learningPathId) {
    return <div className="p-6 text-slate-900 dark:text-white">Loading...</div>
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <Link href={`/admin/learning-paths/${learningPathId}`}>
          <Button variant="ghost" className="mb-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Path
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Module
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Add a new module to structure the learning journey
        </p>
      </div>

      <Card className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Module Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g., Introduction to React"
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Describe what the intern will learn in this module..."
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label htmlFor="estimatedHours" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Estimated Hours
            </label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              min="1"
              placeholder="e.g., 8"
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Layers className="w-4 h-4 mr-2" />
              {isPending ? 'Creating...' : 'Create Module'}
            </Button>
            <Link href={`/admin/learning-paths/${learningPathId}`}>
              <Button type="button" variant="outline" disabled={isPending} className="border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

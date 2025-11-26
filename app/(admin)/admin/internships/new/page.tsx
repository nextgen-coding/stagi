'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'
import { createInternship } from '@/app/actions/internships'

export default function NewInternshipPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      department: formData.get('department') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      location: formData.get('location') as string,
      duration: formData.get('duration') as string,
    }
    
    // Validation
    if (!data.title || !data.department || !data.description) {
      setError('Please fill in all required fields')
      return
    }
    
    startTransition(async () => {
      const result = await createInternship(data)
      
      if (result.success) {
        router.push('/admin/internships')
        router.refresh()
      } else {
        setError(result.error || 'Failed to create internship')
      }
    })
  }
  
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/internships">
          <Button variant="ghost" className="mb-4 dark:text-slate-300 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Internships
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Internship
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Add a new internship to start accepting applications
        </p>
      </div>
      
      {/* Form */}
      <Card className="p-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Internship Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g., Software Engineering Intern"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="department"
              name="department"
              required
              placeholder="e.g., Engineering"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., San Francisco, CA or Remote"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="e.g., 3 months, Summer 2025"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={6}
              placeholder="List the qualifications, skills, and experience required for this internship..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              {isPending ? 'Creating...' : 'Create Internship'}
            </Button>
            <Link href="/admin/internships" className="w-full sm:w-auto">
              <Button type="button" variant="outline" disabled={isPending} className="w-full dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
      
      {/* Help Text */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg h-fit">
            <Briefcase className="w-5 h-5 text-blue-700 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Tips for Creating Internships</h3>
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
              <li>Be clear and specific about the role and responsibilities</li>
              <li>Include both required and preferred qualifications</li>
              <li>Mention any perks, learning opportunities, or unique benefits</li>
              <li>Keep the description concise but informative (300-500 words)</li>
              <li>The internship will be created as "Open" and ready to accept applications</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  X,
  Sparkles,
  Pencil,
} from 'lucide-react'
import { updateSkill } from '@/app/actions/settings'

type Department = {
  id: string
  name: string
  color: string | null
  isActive: boolean
}

type Category = {
  id: string
  name: string
  color: string | null
  isActive: boolean
}

type Skill = {
  id: string
  name: string
  description: string | null
  departmentId: string
  categoryId?: string | null
  category: string | null
  isActive: boolean
}

type EditSkillDialogProps = {
  skill: Skill
  departments: Department[]
  categories: Category[]
  isOpen: boolean
  onClose: () => void
}

export function EditSkillDialog({ skill, departments, categories, isOpen, onClose }: EditSkillDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const activeDepartments = departments.filter(d => d.isActive)
  const activeCategories = categories.filter(c => c.isActive)
  
  // Find category by name if categoryId is not set
  const initialCategoryId = skill.categoryId || categories.find(c => c.name === skill.category)?.id || ''
  
  const [formData, setFormData] = useState({
    name: skill.name,
    description: skill.description || '',
    departmentId: skill.departmentId,
    categoryId: initialCategoryId
  })

  useEffect(() => {
    if (isOpen) {
      const catId = skill.categoryId || categories.find(c => c.name === skill.category)?.id || ''
      setFormData({
        name: skill.name,
        description: skill.description || '',
        departmentId: skill.departmentId,
        categoryId: catId
      })
      setError(null)
    }
  }, [isOpen, skill, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.name.trim()) {
      setError('Skill name is required')
      return
    }
    
    if (!formData.departmentId) {
      setError('Please select a department')
      return
    }
    
    const selectedCategory = activeCategories.find(c => c.id === formData.categoryId)
    
    startTransition(async () => {
      const result = await updateSkill(skill.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        departmentId: formData.departmentId,
        categoryId: formData.categoryId || null,
        category: selectedCategory?.name || undefined
      })
      
      if (result.success) {
        onClose()
        router.refresh()
      } else {
        setError(result.error || 'Failed to update skill')
      }
    })
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const selectedDepartment = departments.find(d => d.id === formData.departmentId)
  const selectedCategory = activeCategories.find(c => c.id === formData.categoryId)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Edit Skill
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, Python, Figma"
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="">Select a department</option>
              {activeDepartments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
              {/* Also show current department even if inactive */}
              {!activeDepartments.find(d => d.id === skill.departmentId) && (
                <option value={skill.departmentId}>
                  {departments.find(d => d.id === skill.departmentId)?.name || 'Unknown'} (Inactive)
                </option>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="">No category</option>
              {activeCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this skill..."
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>
          
          {/* Preview */}
          {formData.name && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                Preview
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-slate-100 dark:bg-slate-700"
                >
                  <Sparkles 
                    className="w-3 h-3" 
                    style={{ color: selectedDepartment?.color || '#8B5CF6' }} 
                  />
                  <span className="text-slate-900 dark:text-white">{formData.name}</span>
                  {selectedCategory && (
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${selectedCategory.color}20`,
                        color: selectedCategory.color || '#8B5CF6'
                      }}
                    >
                      {selectedCategory.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="border-slate-300 dark:border-slate-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

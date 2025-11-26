'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  X,
  Pencil,
  Check
} from 'lucide-react'
import { updateCategory } from '@/app/actions/settings'

type Category = {
  id: string
  name: string
  description: string | null
  color: string | null
  isActive: boolean
}

type EditCategoryDialogProps = {
  category: Category
  colors: readonly { name: string; value: string }[]
  isOpen: boolean
  onClose: () => void
}

export function EditCategoryDialog({ category, colors, isOpen, onClose }: EditCategoryDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || '',
    color: category.color || colors[0].value
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color || colors[0].value
      })
      setError(null)
    }
  }, [isOpen, category, colors])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.name.trim()) {
      setError('Category name is required')
      return
    }
    
    startTransition(async () => {
      const result = await updateCategory(category.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color
      })
      
      if (result.success) {
        onClose()
        router.refresh()
      } else {
        setError(result.error || 'Failed to update category')
      }
    })
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

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
              Edit Category
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
              placeholder="e.g., Programming Language, Framework"
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this category..."
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>
          
          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.color === color.value && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Preview */}
          {formData.name && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                Preview
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-slate-900 dark:text-white font-medium">{formData.name}</span>
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

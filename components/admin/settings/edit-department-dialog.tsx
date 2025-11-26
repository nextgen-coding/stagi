'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  X,
  Building2,
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  Users,
  Shield,
  Database,
  Globe,
  Megaphone,
  Wrench,
  BookOpen,
  Heart,
  Check
} from 'lucide-react'
import { updateDepartment } from '@/app/actions/settings'

const iconComponents: Record<string, any> = {
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  Users,
  Shield,
  Database,
  Globe,
  Megaphone,
  Wrench,
  BookOpen,
  Heart
}

type Department = {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  isActive: boolean
}

type EditDepartmentDialogProps = {
  department: Department
  colors: readonly { name: string; value: string }[]
  icons: readonly string[]
  open: boolean
  onClose: () => void
}

export function EditDepartmentDialog({ department, colors, icons, open, onClose }: EditDepartmentDialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: department.name,
    description: department.description || '',
    color: department.color || colors[0].value,
    icon: department.icon || icons[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.name.trim()) {
      setError('Department name is required')
      return
    }
    
    startTransition(async () => {
      const result = await updateDepartment(department.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        icon: formData.icon
      })
      
      if (result.success) {
        onClose()
        router.refresh()
      } else {
        setError(result.error || 'Failed to update department')
      }
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Edit Department
            </h2>
          </div>
          <button
            onClick={onClose}
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
              placeholder="e.g., Engineering"
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this department..."
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.color === color.value && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1.5">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {icons.map((icon) => {
                const IconComponent = iconComponents[icon] || Briefcase
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      formData.icon === icon 
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                    title={icon}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Preview */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              Preview
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {(() => {
                  const PreviewIcon = iconComponents[formData.icon] || Briefcase
                  return <PreviewIcon className="w-5 h-5" style={{ color: formData.color }} />
                })()}
              </div>
              <span className="font-medium text-slate-900 dark:text-white">
                {formData.name || 'Department Name'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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

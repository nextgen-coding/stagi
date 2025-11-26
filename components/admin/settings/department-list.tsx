'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
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
  Sparkles
} from 'lucide-react'
import { updateDepartment, deleteDepartment } from '@/app/actions/settings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditDepartmentDialog } from './edit-department-dialog'

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
  _count: {
    internships: number
    skills: number
  }
}

type DepartmentListProps = {
  departments: Department[]
  colors: readonly { name: string; value: string }[]
  icons: readonly string[]
}

export function DepartmentList({ departments, colors, icons }: DepartmentListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  const handleToggleStatus = (department: Department) => {
    startTransition(async () => {
      const result = await updateDepartment(department.id, { isActive: !department.isActive })
      if (!result.success) {
        alert(result.error || 'Failed to update department')
      }
      router.refresh()
    })
  }

  const handleDelete = (department: Department) => {
    if (department._count.internships > 0) {
      alert(`Cannot delete department with ${department._count.internships} internship(s). Please reassign them first.`)
      return
    }

    const confirmed = confirm(
      `Are you sure you want to delete "${department.name}"? This will also delete ${department._count.skills} skill(s) associated with it.`
    )

    if (confirmed) {
      startTransition(async () => {
        const result = await deleteDepartment(department.id)
        if (!result.success) {
          alert(result.error || 'Failed to delete department')
        }
        router.refresh()
      })
    }
  }

  if (departments.length === 0) {
    return (
      <Card className="p-8 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
            <Building2 className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No departments yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create your first department to organize internships
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {departments.map((department) => {
          const IconComponent = iconComponents[department.icon || 'Briefcase'] || Briefcase
          
          return (
            <Card 
              key={department.id} 
              className={`p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all hover:shadow-md ${
                !department.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${department.color}20` }}
                >
                  <IconComponent 
                    className="w-5 h-5" 
                    style={{ color: department.color || '#3B82F6' }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {department.name}
                        </h3>
                        {!department.isActive && (
                          <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      {department.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">
                          {department.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {department._count.internships} internships
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {department._count.skills} skills
                        </span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={isPending}
                          className="h-8 w-8 p-0 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <DropdownMenuItem 
                          onClick={() => setEditingDepartment(department)}
                          className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(department)}
                          className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {department.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(department)}
                          disabled={department._count.internships > 0}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      
      {editingDepartment && (
        <EditDepartmentDialog
          department={editingDepartment}
          colors={colors}
          icons={icons}
          open={!!editingDepartment}
          onClose={() => setEditingDepartment(null)}
        />
      )}
    </>
  )
}

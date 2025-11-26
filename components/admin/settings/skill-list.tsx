'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Building2,
  FolderTree
} from 'lucide-react'
import { updateSkill, deleteSkill } from '@/app/actions/settings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditSkillDialog } from './edit-skill-dialog'

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
  categoryId?: string | null
  category: string | null
  isActive: boolean
  department: Department
  _count: {
    internships: number
  }
}

type SkillListProps = {
  skills: Skill[]
  departments: Department[]
  categories: Category[]
}

export function SkillList({ skills, departments, categories }: SkillListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredSkills = skills.filter(skill => {
    if (filterDepartment !== 'all' && skill.department.id !== filterDepartment) return false
    if (filterCategory !== 'all') {
      const cat = categories.find(c => c.id === filterCategory)
      if (!cat || skill.category !== cat.name) return false
    }
    return true
  })

  // Group skills by department
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const deptId = skill.department.id
    if (!acc[deptId]) {
      acc[deptId] = {
        department: skill.department,
        skills: []
      }
    }
    acc[deptId].skills.push(skill)
    return acc
  }, {} as Record<string, { department: Department; skills: Skill[] }>)

  const handleToggleStatus = (skill: Skill) => {
    startTransition(async () => {
      const result = await updateSkill(skill.id, { isActive: !skill.isActive })
      if (!result.success) {
        alert(result.error || 'Failed to update skill')
      }
      router.refresh()
    })
  }

  const handleDelete = (skill: Skill) => {
    if (skill._count.internships > 0) {
      alert(`Cannot delete skill assigned to ${skill._count.internships} internship(s). Please remove assignments first.`)
      return
    }

    const confirmed = confirm(`Are you sure you want to delete "${skill.name}"?`)

    if (confirmed) {
      startTransition(async () => {
        const result = await deleteSkill(skill.id)
        if (!result.success) {
          alert(result.error || 'Failed to delete skill')
        }
        router.refresh()
      })
    }
  }

  if (skills.length === 0) {
    return (
      <Card className="p-8 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
            <Sparkles className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No skills yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Add skills to departments to define internship requirements
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.filter(c => c.isActive).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Skills grouped by department */}
      <div className="space-y-4">
        {Object.values(groupedSkills).map(({ department, skills: deptSkills }) => (
          <Card key={department.id} className="p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: department.color || '#3B82F6' }}
              />
              <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                {department.name}
              </h3>
              <Badge variant="outline" className="text-xs ml-auto bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                {deptSkills.length} skills
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {deptSkills.map((skill) => {
                const skillCategory = categories.find(c => c.name === skill.category)
                return (
                <div
                  key={skill.id}
                  className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                    skill.isActive 
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <Sparkles className="w-3 h-3" style={{ color: department.color || '#3B82F6' }} />
                  <span>{skill.name}</span>
                  {skill.category && (
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: skillCategory?.color ? `${skillCategory.color}20` : '#8B5CF620',
                        color: skillCategory?.color || '#8B5CF6'
                      }}
                    >
                      {skill.category}
                    </span>
                  )}
                  {skill._count.internships > 0 && (
                    <Badge className="text-xs px-1.5 py-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {skill._count.internships}
                    </Badge>
                  )}
                  
                  {/* Hover actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="ml-1 p-0.5 rounded hover:bg-slate-300 dark:hover:bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <DropdownMenuItem 
                        onClick={() => setEditingSkill(skill)}
                        className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(skill)}
                        className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        {skill.isActive ? (
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
                        onClick={() => handleDelete(skill)}
                        disabled={skill._count.internships > 0}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )})}
            </div>
          </Card>
        ))}
      </div>
      
      {filteredSkills.length === 0 && skills.length > 0 && (
        <Card className="p-6 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">No skills match your filters</p>
        </Card>
      )}
      
      {editingSkill && (
        <EditSkillDialog
          skill={{
            ...editingSkill,
            departmentId: editingSkill.department.id
          }}
          departments={departments}
          categories={categories}
          isOpen={!!editingSkill}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </>
  )
}

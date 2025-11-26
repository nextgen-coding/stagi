'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Tag,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
} from 'lucide-react'
import { updateCategory, deleteCategory } from '@/app/actions/settings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EditCategoryDialog } from './edit-category-dialog'

type Category = {
  id: string
  name: string
  description: string | null
  color: string | null
  isActive: boolean
  _count: {
    skills: number
  }
}

type CategoryListProps = {
  categories: Category[]
  colors: readonly { name: string; value: string }[]
}

export function CategoryList({ categories, colors }: CategoryListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleToggleStatus = (category: Category) => {
    startTransition(async () => {
      const result = await updateCategory(category.id, { isActive: !category.isActive })
      if (!result.success) {
        alert(result.error || 'Failed to update category')
      }
      router.refresh()
    })
  }

  const handleDelete = (category: Category) => {
    if (category._count.skills > 0) {
      alert(`Cannot delete category with ${category._count.skills} skill(s). Please reassign them first.`)
      return
    }

    const confirmed = confirm(`Are you sure you want to delete "${category.name}"?`)

    if (confirmed) {
      startTransition(async () => {
        const result = await deleteCategory(category.id)
        if (!result.success) {
          alert(result.error || 'Failed to delete category')
        }
        router.refresh()
      })
    }
  }

  if (categories.length === 0) {
    return (
      <Card className="p-8 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
            <Tag className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No categories yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Add categories to organize your skills
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className={`p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow ${
              !category.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color || '#8B5CF6' }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    {!category.isActive && (
                      <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                  {category._count.skills} skills
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <DropdownMenuItem 
                      onClick={() => setEditingCategory(category)}
                      className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(category)}
                      className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {category.isActive ? (
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
                      onClick={() => handleDelete(category)}
                      disabled={category._count.skills > 0}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          colors={colors}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  )
}

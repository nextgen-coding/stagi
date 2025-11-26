'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical,
  BookOpen
} from 'lucide-react'
import { updateLearningPath, deleteLearningPath } from '@/app/actions/learning'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type LearningPath = {
  id: string
  title: string
  isActive: boolean
  _count: {
    internProgress: number
  }
}

export function LearningPathActions({ learningPath }: { learningPath: LearningPath }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await updateLearningPath(learningPath.id, { isActive: !learningPath.isActive })
      
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update status')
      }
    })
  }

  const handleDelete = () => {
    if (learningPath._count.internProgress > 0) {
      alert('Cannot delete learning path with active interns. Archive it instead.')
      return
    }

    const confirmed = confirm(
      `Are you sure you want to delete "${learningPath.title}"? This action cannot be undone.`
    )

    if (confirmed) {
      setIsDeleting(true)
      startTransition(async () => {
        const result = await deleteLearningPath(learningPath.id)
        
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || 'Failed to delete learning path')
          setIsDeleting(false)
        }
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/admin/learning-paths/${learningPath.id}`)}
        disabled={isPending || isDeleting}
        className="gap-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <BookOpen className="w-4 h-4" />
        Manage
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending || isDeleting} className="border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DropdownMenuItem onClick={handleToggleStatus} className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
            {learningPath.isActive ? (
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
          <DropdownMenuItem
            onClick={() => router.push(`/admin/learning-paths/edit/${learningPath.id}`)}
            className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={learningPath._count.internProgress > 0}
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {learningPath._count.internProgress > 0 
              ? `Delete (${learningPath._count.internProgress} active)` 
              : 'Delete'
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

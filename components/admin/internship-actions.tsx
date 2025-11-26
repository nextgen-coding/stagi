'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical
} from 'lucide-react'
import { updateInternship, deleteInternship } from '@/app/actions/internships'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Internship = {
  id: string
  title: string
  isOpen: boolean
  _count: {
    applications: number
  }
}

export function InternshipActions({ internship }: { internship: Internship }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await updateInternship(internship.id, { isOpen: !internship.isOpen })
      
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to update status')
      }
    })
  }

  const handleDelete = () => {
    if (internship._count.applications > 0) {
      alert('Cannot delete internship with applications. Close it instead.')
      return
    }

    const confirmed = confirm(
      `Are you sure you want to delete "${internship.title}"? This action cannot be undone.`
    )

    if (confirmed) {
      setIsDeleting(true)
      startTransition(async () => {
        const result = await deleteInternship(internship.id)
        
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || 'Failed to delete internship')
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
        onClick={handleToggleStatus}
        disabled={isPending || isDeleting}
        className="gap-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        {internship.isOpen ? (
          <>
            <EyeOff className="w-4 h-4" />
            Close
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Open
          </>
        )}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending || isDeleting} className="border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DropdownMenuItem
            onClick={() => router.push(`/admin/internships/edit/${internship.id}`)}
            className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={internship._count.applications > 0}
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {internship._count.applications > 0 
              ? `Delete (${internship._count.applications} apps)` 
              : 'Delete'
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

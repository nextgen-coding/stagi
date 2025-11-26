'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Eye,
  BookOpen,
  Users,
  Layers,
  Clock,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateLearningPath, deleteLearningPath } from '@/app/actions/learning'

export type LearningPath = {
  id: string
  title: string
  description: string | null
  isActive: boolean
  estimatedDays: number | null
  createdAt: string
  internship: { id: string; title: string } | null
  _count: {
    modules: number
    internProgress: number
  }
  avgProgress: number
}

const statusConfig = {
  active: {
    label: 'Active',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    icon: XCircle,
  },
}

interface LearningPathsDataTableProps {
  data: LearningPath[]
  internships: { id: string; title: string }[]
}

export function LearningPathsDataTable({ data, internships }: LearningPathsDataTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [internshipFilter, setInternshipFilter] = React.useState<string>('all')

  const handleToggleStatus = (learningPath: LearningPath) => {
    startTransition(async () => {
      const result = await updateLearningPath(learningPath.id, { isActive: !learningPath.isActive })
      if (result.success) {
        router.refresh()
      }
    })
  }

  const handleDelete = (learningPath: LearningPath) => {
    if (learningPath._count.internProgress > 0) {
      alert('Cannot delete learning path with active interns. Deactivate it instead.')
      return
    }
    
    const confirmed = confirm(`Are you sure you want to delete "${learningPath.title}"?`)
    if (confirmed) {
      startTransition(async () => {
        const result = await deleteLearningPath(learningPath.id)
        if (result.success) {
          router.refresh()
        }
      })
    }
  }

  const columns: ColumnDef<LearningPath>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Learning Path
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const learningPath = row.original
        return (
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${learningPath.isActive ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <BookOpen className={`h-4 w-4 ${learningPath.isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-white">
                {learningPath.title}
              </span>
              {learningPath.description && (
                <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[250px]">
                  {learningPath.description}
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'internship',
      header: 'Linked Internship',
      cell: ({ row }) => {
        const internship = row.original.internship
        return internship ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
            {internship.title}
          </Badge>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'modules',
      header: 'Modules',
      cell: ({ row }) => {
        const count = row.original._count.modules
        return (
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Layers className="h-3.5 w-3.5" />
            {count}
          </div>
        )
      },
    },
    {
      accessorKey: 'interns',
      header: 'Interns',
      cell: ({ row }) => {
        const count = row.original._count.internProgress
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{count}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'estimatedDays',
      header: 'Duration',
      cell: ({ row }) => {
        const days = row.original.estimatedDays
        return days ? (
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {days} days
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'avgProgress',
      header: 'Progress',
      cell: ({ row }) => {
        const progress = row.original.avgProgress
        const hasInterns = row.original._count.internProgress > 0
        
        if (!hasInterns) {
          return <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        }
        
        return (
          <div className="flex items-center gap-2 min-w-[80px]">
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-8">{progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const isActive = row.original.isActive
        const config = isActive ? statusConfig.active : statusConfig.inactive
        const Icon = config.icon
        return (
          <Badge variant="outline" className={`${config.color} gap-1 font-medium`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return value === 'active' ? row.getValue(id) === true : row.getValue(id) === false
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const learningPath = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/learning-paths/${learningPath.id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View & Manage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/learning-paths/${learningPath.id}/edit`} className="flex items-center cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleStatus(learningPath)}>
                {learningPath.isActive ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(learningPath)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Apply custom filters
  const filteredData = React.useMemo(() => {
    let filtered = data

    if (globalFilter) {
      const search = globalFilter.toLowerCase()
      filtered = filtered.filter(lp => 
        lp.title.toLowerCase().includes(search) ||
        lp.description?.toLowerCase().includes(search) ||
        lp.internship?.title.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lp => statusFilter === 'active' ? lp.isActive : !lp.isActive)
    }

    if (internshipFilter !== 'all') {
      if (internshipFilter === 'unlinked') {
        filtered = filtered.filter(lp => !lp.internship)
      } else {
        filtered = filtered.filter(lp => lp.internship?.id === internshipFilter)
      }
    }

    return filtered
  }, [data, globalFilter, statusFilter, internshipFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const clearFilters = () => {
    setGlobalFilter('')
    setStatusFilter('all')
    setInternshipFilter('all')
  }

  const hasActiveFilters = globalFilter || statusFilter !== 'all' || internshipFilter !== 'all'

  // Stats
  const stats = React.useMemo(() => ({
    total: data.length,
    active: data.filter(lp => lp.isActive).length,
    inactive: data.filter(lp => !lp.isActive).length,
    interns: data.reduce((acc, lp) => acc + lp._count.internProgress, 0),
    modules: data.reduce((acc, lp) => acc + lp._count.modules, 0),
  }), [data])

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/25">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Learning Paths
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create and manage learning paths
            </p>
          </div>
        </div>

        {/* Stats Pills - Next to title */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.active}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <XCircle className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{stats.inactive}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.interns}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{stats.modules}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* New Learning Path Button */}
        <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/25">
          <Link href="/admin/learning-paths/new">
            <Plus className="mr-2 h-4 w-4" />
            New Learning Path
          </Link>
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        {/* Search - Takes all remaining space */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder="Search learning paths..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 w-full text-sm"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Active
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-slate-500" />
                Inactive
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Internship Filter */}
        <Select value={internshipFilter} onValueChange={setInternshipFilter}>
          <SelectTrigger className="w-[160px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Internship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Internships</SelectItem>
            <SelectItem value="unlinked">Unlinked</SelectItem>
            {internships.map((internship) => (
              <SelectItem key={internship.id} value={internship.id}>
                {internship.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 px-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredData.length} of {data.length} learning paths
        </p>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-slate-600 dark:text-slate-300 font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                        <BookOpen className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        No learning paths found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        {hasActiveFilters 
                          ? 'Try adjusting your filters' 
                          : 'Get started by creating your first learning path'}
                      </p>
                      {!hasActiveFilters && (
                        <Button asChild size="sm">
                          <Link href="/admin/learning-paths/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Learning Path
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-slate-200 dark:border-slate-700"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-slate-200 dark:border-slate-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

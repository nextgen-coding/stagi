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
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  Briefcase,
  ExternalLink,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

export type InternProgress = {
  id: string
  userId: string
  progressPercent: number
  startedAt: string | null
  completedAt: string | null
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  learningPath: {
    id: string
    title: string
    estimatedDays: number | null
  }
  application: {
    internship: {
      id: string
      title: string
    }
  } | null
}

const statusConfig = {
  completed: {
    label: 'Completed',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  inProgress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: TrendingUp,
  },
}

interface InternProgressDataTableProps {
  data: InternProgress[]
  learningPaths: { id: string; title: string }[]
}

export function InternProgressDataTable({ data, learningPaths }: InternProgressDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'progressPercent', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [learningPathFilter, setLearningPathFilter] = React.useState<string>('all')

  const columns: ColumnDef<InternProgress>[] = [
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
      accessorKey: 'user',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Intern
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const intern = row.original
        const userName = intern.user.firstName && intern.user.lastName
          ? `${intern.user.firstName} ${intern.user.lastName}`
          : intern.user.email.split('@')[0]
        const initials = intern.user.firstName && intern.user.lastName
          ? `${intern.user.firstName[0]}${intern.user.lastName[0]}`
          : intern.user.email[0].toUpperCase()
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-white">
                {userName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {intern.user.email}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'learningPath',
      header: 'Learning Path',
      cell: ({ row }) => {
        const learningPath = row.original.learningPath
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
              <BookOpen className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 max-w-[180px] truncate">
              {learningPath.title}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'internship',
      header: 'Internship',
      cell: ({ row }) => {
        const application = row.original.application
        return application?.internship ? (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            {application.internship.title}
          </Badge>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'progressPercent',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Progress
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const progress = row.original.progressPercent
        const getProgressColor = (p: number) => {
          if (p >= 80) return 'from-emerald-500 to-green-500'
          if (p >= 50) return 'from-blue-500 to-cyan-500'
          if (p >= 25) return 'from-yellow-500 to-orange-500'
          return 'from-slate-400 to-slate-500'
        }
        
        return (
          <div className="flex items-center gap-3 min-w-[120px]">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-10 text-right">
              {progress}%
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'startedAt',
      header: 'Started',
      cell: ({ row }) => {
        const startedAt = row.original.startedAt
        if (!startedAt) {
          return <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        }
        
        const date = new Date(startedAt)
        const daysSince = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
        
        return (
          <div className="flex flex-col">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {daysSince} days ago
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'completedAt',
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
        const completedAt = row.original.completedAt
        const config = completedAt ? statusConfig.completed : statusConfig.inProgress
        const Icon = config.icon
        return (
          <Badge variant="outline" className={`${config.color} gap-1 font-medium`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const intern = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/learning-paths/${intern.learningPath.id}`} className="flex items-center cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Learning Path
                </Link>
              </DropdownMenuItem>
              {intern.application?.internship && (
                <DropdownMenuItem asChild>
                  <Link href={`/admin/internships/${intern.application.internship.id}`} className="flex items-center cursor-pointer">
                    <Briefcase className="mr-2 h-4 w-4" />
                    View Internship
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/users?id=${intern.userId}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View User Profile
                </Link>
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
      filtered = filtered.filter(ip => {
        const userName = `${ip.user.firstName || ''} ${ip.user.lastName || ''}`.toLowerCase()
        return userName.includes(search) ||
          ip.user.email.toLowerCase().includes(search) ||
          ip.learningPath.title.toLowerCase().includes(search)
      })
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ip => 
        statusFilter === 'completed' ? ip.completedAt : !ip.completedAt
      )
    }

    if (learningPathFilter !== 'all') {
      filtered = filtered.filter(ip => ip.learningPath.id === learningPathFilter)
    }

    return filtered
  }, [data, globalFilter, statusFilter, learningPathFilter])

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
    setLearningPathFilter('all')
  }

  const hasActiveFilters = globalFilter || statusFilter !== 'all' || learningPathFilter !== 'all'

  // Stats
  const stats = React.useMemo(() => {
    const avgProgress = data.length > 0
      ? Math.round(data.reduce((sum, ip) => sum + ip.progressPercent, 0) / data.length)
      : 0
    
    return {
      total: data.length,
      active: data.filter(ip => !ip.completedAt).length,
      completed: data.filter(ip => ip.completedAt).length,
      avgProgress,
    }
  }, [data])

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/25">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Intern Progress
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track learning progress
            </p>
          </div>
        </div>

        {/* Stats Pills - Next to title */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.active}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.completed}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{stats.avgProgress}% avg</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        {/* Search - Takes all remaining space */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder="Search interns, emails, learning paths..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 w-full text-sm"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="inProgress">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                In Progress
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Completed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Learning Path Filter */}
        <Select value={learningPathFilter} onValueChange={setLearningPathFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Learning Path" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Paths</SelectItem>
            {learningPaths.map((lp) => (
              <SelectItem key={lp.id} value={lp.id}>
                {lp.title}
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
          Showing {filteredData.length} of {data.length} interns
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
                        <Users className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        No intern progress found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        {hasActiveFilters 
                          ? 'Try adjusting your filters' 
                          : 'No interns have been assigned to learning paths yet'}
                      </p>
                      {!hasActiveFilters && (
                        <Button asChild size="sm">
                          <Link href="/admin/applications">
                            Review Applications
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

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
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  X,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateApplicationStatus } from '@/app/actions/applications'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type Application = {
  id: string
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'
  fullName: string
  email: string
  phone: string
  appliedAt: string
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  internship: {
    id: string
    title: string
    department: string
  }
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    icon: Clock,
  },
  REVIEWING: {
    label: 'Reviewing',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: Eye,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    icon: XCircle,
  },
}

const departmentColors: Record<string, string> = {
  'Engineering': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Marketing': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Creative': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Data': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Finance': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'People': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface ApplicationsDataTableProps {
  data: Application[]
  departments: string[]
  internships: { id: string; title: string }[]
}

export function ApplicationsDataTable({ data, departments, internships }: ApplicationsDataTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'appliedAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('all')
  const [internshipFilter, setInternshipFilter] = React.useState<string>('all')

  const handleStatusChange = async (applicationId: string, newStatus: Application['status']) => {
    await updateApplicationStatus(applicationId, newStatus)
    router.refresh()
  }

  const columns: ColumnDef<Application>[] = [
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
      header: 'Applicant',
      cell: ({ row }) => {
        const user = row.original.user
        const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-white">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                {user.email}
              </span>
            </div>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const user = row.original.user
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        return fullName.includes(value.toLowerCase()) || user.email.toLowerCase().includes(value.toLowerCase())
      },
    },
    {
      accessorKey: 'internship',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Position
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const internship = row.original.internship
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-slate-900 dark:text-white">{internship.title}</span>
            <Badge variant="outline" className={`w-fit text-[10px] px-1.5 py-0 ${departmentColors[internship.department] || ''}`}>
              {internship.department}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.original.internship.id === value
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      accessorFn: (row) => row.internship.department,
      filterFn: (row, id, value) => {
        if (value === 'all') return true
        return row.original.internship.department === value
      },
      cell: ({ row }) => null, // Hidden column, used only for filtering
    },
    {
      accessorKey: 'status',
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
        const status = row.getValue('status') as keyof typeof statusConfig
        const config = statusConfig[status]
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
        return row.getValue(id) === value
      },
    },
    {
      accessorKey: 'appliedAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Applied
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('appliedAt'))
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        
        let timeAgo = ''
        if (diffDays === 0) timeAgo = 'Today'
        else if (diffDays === 1) timeAgo = 'Yesterday'
        else if (diffDays < 7) timeAgo = `${diffDays} days ago`
        else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`
        else timeAgo = `${Math.floor(diffDays / 30)} months ago`

        return (
          <div className="flex flex-col">
            <span className="text-sm text-slate-900 dark:text-white">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const application = row.original
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
                <Link href={`/admin/applications/${application.id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(application.email)}>
                <Mail className="mr-2 h-4 w-4" />
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Change Status</DropdownMenuLabel>
              {Object.entries(statusConfig).map(([status, config]) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(application.id, status as Application['status'])}
                  disabled={application.status === status}
                  className="flex items-center"
                >
                  <config.icon className="mr-2 h-4 w-4" />
                  {config.label}
                  {application.status === status && (
                    <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              ))}
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
      filtered = filtered.filter(app => 
        app.user.firstName?.toLowerCase().includes(search) ||
        app.user.lastName?.toLowerCase().includes(search) ||
        app.user.email.toLowerCase().includes(search) ||
        app.internship.title.toLowerCase().includes(search) ||
        app.internship.department.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(app => app.internship.department === departmentFilter)
    }

    if (internshipFilter !== 'all') {
      filtered = filtered.filter(app => app.internship.id === internshipFilter)
    }

    return filtered
  }, [data, globalFilter, statusFilter, departmentFilter, internshipFilter])

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
      columnVisibility: {
        ...columnVisibility,
        department: false, // Hide department column (used only for filtering)
      },
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
    setDepartmentFilter('all')
    setInternshipFilter('all')
  }

  const hasActiveFilters = globalFilter || statusFilter !== 'all' || departmentFilter !== 'all' || internshipFilter !== 'all'

  // Stats
  const stats = React.useMemo(() => ({
    total: data.length,
    pending: data.filter(a => a.status === 'PENDING').length,
    reviewing: data.filter(a => a.status === 'REVIEWING').length,
    accepted: data.filter(a => a.status === 'ACCEPTED').length,
    rejected: data.filter(a => a.status === 'REJECTED').length,
  }), [data])

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Applications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage internship applications
            </p>
          </div>
        </div>

        {/* Stats Pills - Next to title */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">{stats.pending}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.reviewing}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.accepted}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        {/* Search - Takes all remaining space */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder="Search applicants, positions, departments..."
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
            {Object.entries(statusConfig).map(([status, config]) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  <config.icon className="h-4 w-4" />
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Internship Filter */}
        <Select value={internshipFilter} onValueChange={setInternshipFilter}>
          <SelectTrigger className="w-[160px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {internships.map((int) => (
              <SelectItem key={int.id} value={int.id}>
                {int.title}
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
          Showing {filteredData.length} of {data.length} applications
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
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
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
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <FileText className="h-10 w-10 mb-2 opacity-50" />
                      <p>No applications found</p>
                      {hasActiveFilters && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={clearFilters}
                          className="mt-1"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              <span>Page</span>
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>
              <span>of</span>
              <span className="font-medium">{table.getPageCount()}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

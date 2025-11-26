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
  EyeOff,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Settings2,
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

export type Internship = {
  id: string
  title: string
  department: string
  location: string | null
  duration: string | null
  isOpen: boolean
  createdAt: string
  _count: {
    applications: number
  }
}

const statusConfig = {
  open: {
    label: 'Open',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: Eye,
  },
  closed: {
    label: 'Closed',
    color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    icon: EyeOff,
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

interface InternshipsDataTableProps {
  data: Internship[]
  departments: string[]
}

export function InternshipsDataTable({ data, departments }: InternshipsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('all')

  const columns: ColumnDef<Internship>[] = [
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
            Position
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const internship = row.original
        return (
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${internship.isOpen ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <Briefcase className={`h-4 w-4 ${internship.isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-white">
                {internship.title}
              </span>
              <Badge variant="outline" className={`w-fit text-[10px] px-1.5 py-0 mt-0.5 ${departmentColors[internship.department] || ''}`}>
                {internship.department}
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const location = row.getValue('location') as string | null
        return location ? (
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        )
      },
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => {
        const duration = row.getValue('duration') as string | null
        return duration ? (
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {duration}
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-sm">—</span>
        )
      },
    },
    {
      accessorKey: '_count.applications',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Applications
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.original._count.applications
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
      accessorKey: 'isOpen',
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
        const isOpen = row.getValue('isOpen') as boolean
        const config = isOpen ? statusConfig.open : statusConfig.closed
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
        return value === 'open' ? row.getValue(id) === true : row.getValue(id) === false
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const internship = row.original
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
                <Link href={`/admin/internships/${internship.id}`} className="flex items-center cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/internships/edit/${internship.id}`} className="flex items-center cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/internships/${internship.id}/apply-settings`} className="flex items-center cursor-pointer">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Application Steps
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/internship/${internship.id}`} target="_blank" className="flex items-center cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public Page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
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
      filtered = filtered.filter(int => 
        int.title.toLowerCase().includes(search) ||
        int.department.toLowerCase().includes(search) ||
        int.location?.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(int => statusFilter === 'open' ? int.isOpen : !int.isOpen)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(int => int.department === departmentFilter)
    }

    return filtered
  }, [data, globalFilter, statusFilter, departmentFilter])

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
    setDepartmentFilter('all')
  }

  const hasActiveFilters = globalFilter || statusFilter !== 'all' || departmentFilter !== 'all'

  // Stats
  const stats = React.useMemo(() => ({
    total: data.length,
    open: data.filter(i => i.isOpen).length,
    closed: data.filter(i => !i.isOpen).length,
    applications: data.reduce((acc, i) => acc + i._count.applications, 0),
  }), [data])

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Internships
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage internship positions
            </p>
          </div>
        </div>

        {/* Stats Pills - Next to title */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Briefcase className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.open}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <EyeOff className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">{stats.closed}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.applications}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* New Internship Button */}
        <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
          <Link href="/admin/internships/new">
            <Plus className="mr-2 h-4 w-4" />
            New Internship
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
            placeholder="Search internships, departments, locations..."
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
            <SelectItem value="open">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-500" />
                Open
              </div>
            </SelectItem>
            <SelectItem value="closed">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-red-500" />
                Closed
              </div>
            </SelectItem>
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
          Showing {filteredData.length} of {data.length} internships
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
                      <Briefcase className="h-10 w-10 mb-2 opacity-50" />
                      <p>No internships found</p>
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

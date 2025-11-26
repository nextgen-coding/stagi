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
  Search,
  Users,
  Shield,
  User,
  Mail,
  Calendar,
  X,
  FileText,
  Eye,
  UserCog,
  ShieldCheck,
  ShieldOff,
  Pencil,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export type UserData = {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'ADMIN' | 'CANDIDATE' | 'INTERN'
  createdAt: string
  _count: {
    applications: number
  }
}

const roleConfig = {
  ADMIN: {
    label: 'Admin',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: Shield,
    avatarGradient: 'bg-gradient-to-br from-blue-500 to-purple-500',
  },
  CANDIDATE: {
    label: 'Candidate',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: User,
    avatarGradient: 'bg-gradient-to-br from-emerald-500 to-green-500',
  },
  INTERN: {
    label: 'Intern',
    color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    icon: UserCog,
    avatarGradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
}

interface UsersDataTableProps {
  data: UserData[]
}

export function UsersDataTable({ data }: UsersDataTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')

  const columns: ColumnDef<UserData>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        const config = roleConfig[user.role]
        const userName = user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email.split('@')[0]
        const initials = user.firstName && user.lastName
          ? `${user.firstName[0]}${user.lastName[0]}`
          : user.email[0].toUpperCase()
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm">
              <AvatarFallback className={`${config.avatarGradient} text-white text-xs font-medium`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-white">
                {userName}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const role = row.original.role
        const config = roleConfig[role]
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
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <FileText className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{count}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Joined
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.original.createdAt
        const date = new Date(createdAt)
        const daysSince = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
        
        return (
          <div className="flex flex-col">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/admin/users/${user.id}/edit`}>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <span className="sr-only">Edit user</span>
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]

  // Apply custom filters
  const filteredData = React.useMemo(() => {
    let filtered = data

    if (globalFilter) {
      const search = globalFilter.toLowerCase()
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        return fullName.includes(search) ||
          user.email.toLowerCase().includes(search)
      })
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    return filtered
  }, [data, globalFilter, roleFilter])

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
    setRoleFilter('all')
  }

  const hasActiveFilters = globalFilter || roleFilter !== 'all'

  // Stats
  const stats = React.useMemo(() => ({
    total: data.length,
    admins: data.filter(u => u.role === 'ADMIN').length,
    candidates: data.filter(u => u.role === 'CANDIDATE').length,
    interns: data.filter(u => u.role === 'INTERN').length,
  }), [data])

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-slate-500/25">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              User Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage accounts & permissions
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
            <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.admins}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.candidates}</span>
          </div>
          {stats.interns > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <UserCog className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{stats.interns}</span>
            </div>
          )}
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
            placeholder="Search users by name or email..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 w-full text-sm"
          />
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Admin
              </div>
            </SelectItem>
            <SelectItem value="CANDIDATE">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                Candidate
              </div>
            </SelectItem>
            <SelectItem value="INTERN">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-purple-500" />
                Intern
              </div>
            </SelectItem>
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
          Showing {filteredData.length} of {data.length} users
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
                        No users found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {hasActiveFilters 
                          ? 'Try adjusting your filters' 
                          : 'Users will appear here once they register'}
                      </p>
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

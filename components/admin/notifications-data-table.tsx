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
  Bell,
  BellRing,
  Check,
  X,
  Mail,
  MailOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  FileText,
  UserPlus,
  Briefcase,
  GraduationCap,
  Trash2,
  Eye,
  MailCheck,
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

export type Notification = {
  id: string
  type: 'application' | 'user' | 'internship' | 'learning' | 'system'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

const typeConfig = {
  application: {
    label: 'Application',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: FileText,
    iconColor: 'text-blue-500',
  },
  user: {
    label: 'User',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: UserPlus,
    iconColor: 'text-emerald-500',
  },
  internship: {
    label: 'Internship',
    color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    icon: Briefcase,
    iconColor: 'text-purple-500',
  },
  learning: {
    label: 'Learning',
    color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    icon: GraduationCap,
    iconColor: 'text-orange-500',
  },
  system: {
    label: 'System',
    color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    icon: Info,
    iconColor: 'text-slate-500',
  },
}

interface NotificationsDataTableProps {
  data: Notification[]
  onMarkAsRead?: (ids: string[]) => void
  onMarkAllAsRead?: () => void
  onDelete?: (ids: string[]) => void
}

export function NotificationsDataTable({ 
  data, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onDelete 
}: NotificationsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true }
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const columns: ColumnDef<Notification>[] = [
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
      accessorKey: 'notification',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent px-0"
          >
            Notification
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const notification = row.original
        const config = typeConfig[notification.type]
        const Icon = config.icon
        
        return (
          <div className="flex items-start gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${notification.isRead ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <Icon className={`h-4 w-4 ${notification.isRead ? 'text-slate-500 dark:text-slate-400' : config.iconColor}`} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {notification.title}
                </span>
                {!notification.isRead && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {notification.message}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type
        const config = typeConfig[type]
        return (
          <Badge variant="outline" className={`${config.color} font-medium`}>
            {config.label}
          </Badge>
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
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.original.createdAt
        const date = new Date(createdAt)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        let timeAgo = ''
        if (diffMins < 1) {
          timeAgo = 'Just now'
        } else if (diffMins < 60) {
          timeAgo = `${diffMins}m ago`
        } else if (diffHours < 24) {
          timeAgo = `${diffHours}h ago`
        } else if (diffDays < 7) {
          timeAgo = `${diffDays}d ago`
        } else {
          timeAgo = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
        
        return (
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo}
          </div>
        )
      },
    },
    {
      accessorKey: 'isRead',
      header: 'Status',
      cell: ({ row }) => {
        const isRead = row.original.isRead
        return isRead ? (
          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 gap-1">
            <MailOpen className="h-3 w-3" />
            Read
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 gap-1">
            <Mail className="h-3 w-3" />
            Unread
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const notification = row.original
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
              {notification.link && (
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onMarkAsRead?.([notification.id])}>
                {notification.isRead ? (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Mark as Unread
                  </>
                ) : (
                  <>
                    <MailCheck className="mr-2 h-4 w-4" />
                    Mark as Read
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.([notification.id])}
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
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(search) ||
        n.message.toLowerCase().includes(search)
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(n => 
        statusFilter === 'read' ? n.isRead : !n.isRead
      )
    }

    return filtered
  }, [data, globalFilter, typeFilter, statusFilter])

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
    setTypeFilter('all')
    setStatusFilter('all')
  }

  const hasActiveFilters = globalFilter || typeFilter !== 'all' || statusFilter !== 'all'

  // Stats
  const stats = React.useMemo(() => ({
    total: data.length,
    unread: data.filter(n => !n.isRead).length,
    read: data.filter(n => n.isRead).length,
  }), [data])

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stay updated with activity
            </p>
          </div>
        </div>

        {/* Stats Pills - Next to title */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Bell className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <BellRing className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.unread}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.read}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasSelectedRows && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ids = selectedRows.map(row => row.original.id)
                  onMarkAsRead?.(ids)
                }}
                className="border-slate-200 dark:border-slate-700"
              >
                <MailCheck className="mr-2 h-4 w-4" />
                Mark Selected Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ids = selectedRows.map(row => row.original.id)
                  onDelete?.(ids)
                }}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </>
          )}
          {stats.unread > 0 && (
            <Button
              onClick={onMarkAllAsRead}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
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
            placeholder="Search notifications..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 w-full text-sm"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="application">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Application
              </div>
            </SelectItem>
            <SelectItem value="user">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-500" />
                User
              </div>
            </SelectItem>
            <SelectItem value="internship">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-500" />
                Internship
              </div>
            </SelectItem>
            <SelectItem value="learning">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-orange-500" />
                Learning
              </div>
            </SelectItem>
            <SelectItem value="system">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500" />
                System
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unread">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Unread
              </div>
            </SelectItem>
            <SelectItem value="read">
              <div className="flex items-center gap-2">
                <MailOpen className="h-4 w-4 text-slate-500" />
                Read
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
          Showing {filteredData.length} of {data.length} notifications
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
                    className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!row.original.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
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
                        <Bell className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        No notifications
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {hasActiveFilters 
                          ? 'Try adjusting your filters' 
                          : "You're all caught up!"}
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

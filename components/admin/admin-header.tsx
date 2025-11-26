'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Bell,
  Search,
  Command,
  Home,
  ChevronRight,
} from 'lucide-react'

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Map paths to readable names
const pathNameMap: Record<string, string> = {
  'admin': 'Dashboard',
  'applications': 'Applications',
  'internships': 'Internships',
  'learning-paths': 'Learning Paths',
  'progress': 'Intern Progress',
  'users': 'User Management',
  'settings': 'Settings',
  'new': 'Create New',
  'edit': 'Edit',
  'modules': 'Modules',
  'tasks': 'Tasks',
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Skip UUID-like segments in breadcrumb label but keep in path
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
    
    if (isUuid) {
      // For UUIDs, we'll show a generic "Details" or skip
      breadcrumbs.push({
        label: 'Details',
        href: currentPath,
        isLast,
      })
    } else {
      breadcrumbs.push({
        label: pathNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: currentPath,
        isLast,
      })
    }
  })
  
  return breadcrumbs
}

const notifications = [
  {
    id: 1,
    title: 'New Application',
    message: 'John Doe applied for Frontend Developer',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Task Submitted',
    message: 'Sarah completed HTML Basics module',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Progress Update',
    message: 'Mike reached 50% completion',
    time: '3 hours ago',
    unread: false,
  },
]

export function AdminHeader() {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)
  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Home className="h-3.5 w-3.5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.slice(1).map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {crumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[280px] pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {notification.unread && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {notification.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

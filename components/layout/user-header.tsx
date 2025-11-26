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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Map paths to readable names
const pathNameMap: Record<string, string> = {
  'dashboard': 'Dashboard',
  'applications': 'My Applications',
  'learning': 'My Learning Path',
  'internships': 'Browse Internships',
  'settings': 'Settings',
  'browse': 'Browse',
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

export function UserHeader() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Home className="h-3.5 w-3.5" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbSeparator className="hidden md:block">
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

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">⌘K</kbd></p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}

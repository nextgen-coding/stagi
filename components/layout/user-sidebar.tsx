'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BookOpen,
  Settings,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  GraduationCap,
  Search,
  ChevronsUpDown,
  User,
  Bell,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'My Applications',
    url: '/dashboard/applications',
    icon: FileText,
    badge: null,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
]

const discoverItems = [
  {
    title: 'Browse Internships',
    url: '/internships',
    icon: Briefcase,
    badge: null,
  },
]

const learningItems = [
  {
    title: 'My Learning Path',
    url: '/dashboard/learning',
    icon: GraduationCap,
    badge: null,
  },
]

interface UserSidebarProps {
  userRole: 'CANDIDATE' | 'INTERN'
}

export function UserSidebar({ userRole }: UserSidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { state } = useSidebar()
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/sign-in'
  }

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(url)
  }

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.firstName?.[0] || 'U'

  const roleColor = userRole === 'INTERN' 
    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shrink-0">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight sidebar-collapse-hide">
                  <span className="truncate font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    Stagi
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Internship Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="transition-all duration-200"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="sidebar-collapse-hide">{item.title}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px] px-1.5 py-0 sidebar-collapse-hide"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Discover Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            Discover
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {discoverItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="transition-all duration-200"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="sidebar-collapse-hide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Learning Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
            Learning
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learningItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="transition-all duration-200"
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4 shrink-0" />
                      <span className="sidebar-collapse-hide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleDarkMode}
              tooltip={isDark ? 'Light Mode' : 'Dark Mode'}
              className="transition-all duration-200"
            >
              {isDark ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
              <span className="sidebar-collapse-hide">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Menu */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight sidebar-collapse-hide">
                    <span className="truncate font-semibold">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 sidebar-collapse-hide" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                    <Badge className={`${roleColor} text-[10px]`}>
                      {userRole}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

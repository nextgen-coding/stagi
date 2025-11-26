'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser, useClerk } from '@clerk/nextjs'
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings,
  Users,
  Menu,
  X,
  LogOut,
  BookOpen,
  TrendingUp,
  Moon,
  Sun
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  userRole?: 'ADMIN' | 'CANDIDATE'
}

export function Sidebar({ userRole = 'CANDIDATE' }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for dark mode on mount
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
    router.push('/sign-in')
  }
  
  const candidateLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/applications', label: 'My Applications', icon: FileText },
    { href: '/internships', label: 'Browse Internships', icon: Briefcase },
    { href: '/dashboard/learning', label: 'My Learning Path', icon: BookOpen },
  ]
  
  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/applications', label: 'Applications', icon: FileText },
    { href: '/admin/internships', label: 'Internships', icon: Briefcase },
    { href: '/admin/learning-paths', label: 'Learning Paths', icon: BookOpen },
    { href: '/admin/progress', label: 'Intern Progress', icon: TrendingUp },
    { href: '/admin/users', label: 'Users', icon: Users },
  ]
  
  const links = userRole === 'ADMIN' ? adminLinks : candidateLinks
  
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stagi
          </span>
        </Link>
      </div>
      
      {/* User Info */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-10 w-10"
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <Badge 
                variant="secondary" 
                className={userRole === 'ADMIN' 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs' 
                  : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs'
                }
              >
                {userRole}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {userRole === 'CANDIDATE' && (
          <Link
            href="/debug/users"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        )}
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  )
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="sidebar-mobile-toggle fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-slate-900 dark:text-white" />
        ) : (
          <Menu className="h-6 w-6 text-slate-900 dark:text-white" />
        )}
      </button>
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-mobile fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside
        className={`sidebar-mobile fixed top-0 left-0 z-40 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <SidebarContent />
        </div>
      </aside>
      
      {/* Desktop Sidebar - Always visible on lg screens */}
      <aside className="sidebar-desktop fixed top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="h-full w-full flex flex-col overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>
    </>
  )
}

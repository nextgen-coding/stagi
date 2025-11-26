'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { 
  Settings,
  User,
  Loader2,
  Save,
  Mail,
  Calendar,
  FileText,
  Shield,
  UserCog,
  Bell,
  Moon,
  Sun,
  Lock,
  ExternalLink,
  CheckCircle,
  Briefcase,
  LogOut,
  Trash2
} from 'lucide-react'
import { updateCurrentUserProfile } from '@/app/actions/users'

const roleConfig = {
  ADMIN: {
    label: 'Admin',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: Shield,
    gradient: 'from-blue-500 to-cyan-500'
  },
  CANDIDATE: {
    label: 'Candidate',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: User,
    gradient: 'from-emerald-500 to-green-500'
  },
  INTERN: {
    label: 'Intern',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    icon: UserCog,
    gradient: 'from-purple-500 to-pink-500'
  },
}

interface UserApplication {
  id: string
  status: string
  appliedAt: string
  internship: {
    title: string
    department: string
    departmentRef: { name: string } | null
  }
}

interface UserData {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'ADMIN' | 'CANDIDATE' | 'INTERN'
  createdAt: Date
  _count: {
    applications: number
    taskProgress: number
  }
  applications: UserApplication[]
}

interface UserSettingsContentProps {
  user: UserData
}

export function UserSettingsContent({ user }: UserSettingsContentProps) {
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || ''
  })

  const [notifications, setNotifications] = useState({
    email: true,
    applications: true,
    learning: true
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateCurrentUserProfile({
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined
      })

      if (result.success) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.error || 'Failed to update profile')
      }
    })
  }

  const roleInfo = roleConfig[user.role]
  const RoleIcon = roleInfo.icon
  const joinedDate = new Date(user.createdAt)
  const daysSince = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const userName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split('@')[0]
  
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email[0].toUpperCase()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Profile Information
                </CardTitle>
                {success && (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Saved
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 text-sm">
                    {error}
                  </div>
                )}

                {/* Profile Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-md">
                    <AvatarImage src={clerkUser?.imageUrl} alt={userName} />
                    <AvatarFallback className={`bg-gradient-to-br ${roleInfo.gradient} text-white text-lg font-medium`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{userName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={roleInfo.color}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleInfo.label}
                      </Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Member since {joinedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email - Read Only */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{user.email}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Email is managed through your account provider
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isPending}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1.5" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-200 dark:divide-slate-700">
              {/* Theme Toggle */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {isDark ? <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between light and dark theme</p>
                  </div>
                </div>
                <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
              </div>

              {/* Email Notifications */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive email updates about your account</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))} 
                />
              </div>

              {/* Application Updates */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Application Updates</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Get notified about application status changes</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.applications} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, applications: checked }))} 
                />
              </div>

              {/* Learning Reminders */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Learning Reminders</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive reminders about your learning progress</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications.learning} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, learning: checked }))} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Manage Account</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Change password and security settings</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openUserProfile()}
                  className="border-slate-300 dark:border-slate-600"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">Sign Out</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">Sign out of your account on this device</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut({ redirectUrl: '/' })}
                  className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Account Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Applications</span>
                </div>
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{user._count.applications}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Tasks Completed</span>
                </div>
                <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{user._count.taskProgress}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Days Active</span>
                </div>
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">{daysSince}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Recent Applications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {user.applications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full inline-block mb-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">No applications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {user.applications.map((app) => {
                    const statusColor = app.status === 'ACCEPTED' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : app.status === 'REJECTED'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : app.status === 'UNDER_REVIEW'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                    
                    return (
                      <div key={app.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {app.internship.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {app.internship.departmentRef?.name || app.internship.department || 'General'}
                            </p>
                          </div>
                          <Badge variant="outline" className={`${statusColor} text-[10px] px-1.5 py-0 flex-shrink-0`}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

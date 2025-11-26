'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User,
  Loader2,
  Save,
  Mail,
  Calendar,
  FileText,
  Shield,
  UserCog,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'
import { updateUser } from '@/app/actions/users'

const roleOptions = [
  { 
    value: 'CANDIDATE', 
    label: 'Candidate', 
    description: 'Can apply to internships',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-500 to-green-500'
  },
  { 
    value: 'INTERN', 
    label: 'Intern', 
    description: 'Active intern with learning access',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    value: 'ADMIN', 
    label: 'Admin', 
    description: 'Full system access',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 to-cyan-500'
  },
]

interface UserApplication {
  id: string
  status: string
  appliedAt: string
  internship: {
    title: string
  }
}

interface UserData {
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
  applications: UserApplication[]
}

interface EditUserFormProps {
  user: UserData
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    role: user.role
  })

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await updateUser(user.id, {
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        role: formData.role
      })

      if (result.success) {
        router.push('/admin/users')
        router.refresh()
      } else {
        setError(result.error || 'Failed to update user')
      }
    })
  }

  const userName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email.split('@')[0]
  
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email[0].toUpperCase()

  const currentRole = roleOptions.find(r => r.value === user.role)
  const joinedDate = new Date(user.createdAt)
  const daysSince = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Avatar className="h-11 w-11 border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0">
            <AvatarFallback className={`bg-gradient-to-br ${currentRole?.gradient || 'from-slate-500 to-slate-600'} text-white font-medium`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {userName}
              </h1>
              <Badge className={currentRole?.color}>
                {currentRole?.label}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button variant="outline" size="sm" disabled={isPending} className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="edit-user-form"
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
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-600 dark:text-slate-400">Applications:</span>
          <span className="font-semibold text-blue-700 dark:text-blue-300">{user._count.applications}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-slate-600 dark:text-slate-400">Joined:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {joinedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            ({daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`})
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Email - Read Only */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-sm">
                      {user.email}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyEmail}
                      className="border-slate-300 dark:border-slate-600 h-9 px-3"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Email is managed by Clerk authentication
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

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                    User Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {roleOptions.map((role) => {
                      const isSelected = formData.role === role.value
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, role: role.value as 'ADMIN' | 'CANDIDATE' | 'INTERN' }))}
                          disabled={isPending}
                          className={`flex flex-col items-start gap-1 p-3 rounded-lg border transition-all text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded bg-gradient-to-br ${role.gradient}`}>
                              {role.value === 'ADMIN' ? (
                                <Shield className="w-3 h-3 text-white" />
                              ) : role.value === 'INTERN' ? (
                                <UserCog className="w-3 h-3 text-white" />
                              ) : (
                                <User className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {role.label}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {role.description}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Recent Applications */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Recent Applications
                  </CardTitle>
                  {user._count.applications > 0 && (
                    <Link href={`/admin/applications?userId=${user.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        View All
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {user.applications.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full inline-block mb-2">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No applications yet
                    </p>
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
                                {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <Badge variant="outline" className={`${statusColor} text-[10px] px-1.5 py-0`}>
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
      </form>
    </div>
  )
}

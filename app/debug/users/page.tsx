import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, User } from 'lucide-react'
import type { UserRole } from '@prisma/client'

export default async function UsersDebugPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  // Get all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  type UserFromDB = typeof users[0]
  
  const adminCount = users.filter((u: UserFromDB) => u.role === 'ADMIN').length
  const candidateCount = users.filter((u: UserFromDB) => u.role === 'CANDIDATE').length
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Users Database
          </h1>
          <p className="text-slate-600">View all registered users and their roles</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {adminCount}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Candidates</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {candidateCount}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No users found. Sign up to create the first user!
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user: UserFromDB) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-slate-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <Badge className={user.role === 'ADMIN' 
                          ? 'bg-blue-100 text-blue-800 border-blue-200' 
                          : 'bg-green-100 text-green-800 border-green-200'
                        }>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Clerk ID: {user.clerkId}
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <p>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 How to make a user an admin</h3>
            <p className="text-sm text-blue-800 mb-3">
              Run this command in your terminal with the user's email:
            </p>
            <code className="block bg-white p-3 rounded border border-blue-200 text-sm text-slate-900">
              npm run db:make-admin your-email@example.com
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

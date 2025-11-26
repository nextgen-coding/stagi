import { prisma } from '@/lib/prisma'
import { UsersDataTable } from '@/components/admin/users-data-table'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          applications: true
        }
      }
    }
  })
  
  // Format data for the table
  const formattedUsers = users.map((user) => ({
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as 'ADMIN' | 'CANDIDATE' | 'INTERN',
    createdAt: user.createdAt.toISOString(),
    _count: {
      applications: user._count.applications,
    },
  }))
  
  return (
    <div className="p-6 lg:p-8">
      <UsersDataTable data={formattedUsers} />
    </div>
  )
}

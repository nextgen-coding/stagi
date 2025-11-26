import { getCurrentUser } from '@/app/actions/users'
import { redirect } from 'next/navigation'
import type { UserRole } from '@prisma/client'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { UserSidebar } from '@/components/layout/user-sidebar'
import { UserHeader } from '@/components/layout/user-header'
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userResult = await getCurrentUser()
  
  if (!userResult.success) {
    redirect('/sign-in')
  }
  
  // @ts-ignore - TypeScript doesn't narrow discriminated unions well with redirects
  const userRole: UserRole = userResult.data.role
  
  // Redirect admins to admin dashboard
  if (userRole === 'ADMIN') {
    redirect('/admin')
  }

  // Get sidebar state from cookie
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'
  
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <UserSidebar userRole={userRole as 'CANDIDATE' | 'INTERN'} />
      <SidebarInset>
        <UserHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

import { getCurrentUser } from '@/app/actions/users'
import { redirect } from 'next/navigation'
import type { UserRole } from '@prisma/client'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { cookies } from 'next/headers'

export default async function AdminLayout({
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
  
  // Redirect non-admins to candidate dashboard
  if (userRole !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Get sidebar state from cookie
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'
  
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

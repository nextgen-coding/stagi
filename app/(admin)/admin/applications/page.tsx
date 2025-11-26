import { getAllApplications } from '@/app/actions/applications'
import { prisma } from '@/lib/prisma'
import { ApplicationsDataTable } from '@/components/admin/applications-data-table'
import { FileText } from 'lucide-react'

export default async function AdminApplicationsPage() {
  const applicationsResult = await getAllApplications()
  const applications = applicationsResult.success ? applicationsResult.data ?? [] : []
  
  // Get unique departments and internships for filters
  const internships = await prisma.internship.findMany({
    select: { id: true, title: true, department: true },
    orderBy: { title: 'asc' }
  })
  
  const departments = [...new Set(internships.map(i => i.department))].sort()
  
  // Format applications for the table
  const formattedApplications = applications.map((app: any) => ({
    id: app.id,
    status: app.status,
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    appliedAt: app.appliedAt.toISOString(),
    user: {
      id: app.user.id,
      firstName: app.user.firstName,
      lastName: app.user.lastName,
      email: app.user.email,
    },
    internship: {
      id: app.internship.id,
      title: app.internship.title,
      department: app.internship.department,
    },
  }))
  
  return (
    <div className="p-6 lg:p-8">
      {/* Data Table with integrated header */}
      <ApplicationsDataTable 
        data={formattedApplications}
        departments={departments}
        internships={internships.map(i => ({ id: i.id, title: i.title }))}
      />
    </div>
  )
}

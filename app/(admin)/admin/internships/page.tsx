import { getAllInternships } from "@/app/actions/internships"
import { InternshipsDataTable } from "@/components/admin/internships-data-table"

export default async function AdminInternshipsPage() {
  const result = await getAllInternships()
  const internships = result.success ? result.data ?? [] : []
  
  // Get unique departments for filters
  const departments = [...new Set(internships.map((i: any) => i.department))].filter(Boolean).sort() as string[]
  
  // Format internships for the table
  const formattedInternships = internships.map((internship: any) => ({
    id: internship.id,
    title: internship.title,
    department: internship.department,
    location: internship.location,
    duration: internship.duration,
    isOpen: internship.isOpen,
    createdAt: internship.createdAt.toISOString(),
    _count: {
      applications: internship._count.applications,
    },
  }))
  
  return (
    <div className="p-6 lg:p-8">
      <InternshipsDataTable 
        data={formattedInternships}
        departments={departments}
      />
    </div>
  )
}

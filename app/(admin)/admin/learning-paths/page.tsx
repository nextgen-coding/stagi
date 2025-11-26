import { getAllLearningPaths } from "@/app/actions/learning"
import { getAllInternships } from "@/app/actions/internships"
import { LearningPathsDataTable } from "@/components/admin/learning-paths-data-table"

export default async function AdminLearningPathsPage() {
  const [learningPathsResult, internshipsResult] = await Promise.all([
    getAllLearningPaths(),
    getAllInternships(),
  ])
  
  const learningPaths = learningPathsResult.success ? learningPathsResult.data ?? [] : []
  const internships = internshipsResult.success ? internshipsResult.data ?? [] : []
  
  // Format learning paths for the table
  const formattedLearningPaths = learningPaths.map((lp: any) => {
    const avgProgress = lp.internProgress.length > 0
      ? Math.round(lp.internProgress.reduce((acc: number, p: any) => acc + p.progressPercent, 0) / lp.internProgress.length)
      : 0
    
    return {
      id: lp.id,
      title: lp.title,
      description: lp.description,
      isActive: lp.isActive,
      estimatedDays: lp.estimatedDays,
      createdAt: lp.createdAt?.toISOString?.() ?? lp.createdAt,
      internship: lp.internship,
      _count: {
        modules: lp._count.modules,
        internProgress: lp._count.internProgress,
      },
      avgProgress,
    }
  })
  
  // Get unique internships for filter
  const internshipOptions = internships.map((i: any) => ({
    id: i.id,
    title: i.title,
  }))
  
  return (
    <div className="p-6 lg:p-8">
      <LearningPathsDataTable 
        data={formattedLearningPaths}
        internships={internshipOptions}
      />
    </div>
  )
}

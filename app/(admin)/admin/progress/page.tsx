import { getAllInternProgress, getAllLearningPaths } from '@/app/actions/learning'
import { InternProgressDataTable } from '@/components/admin/intern-progress-data-table'

export default async function InternProgressPage() {
  const [progressResult, learningPathsResult] = await Promise.all([
    getAllInternProgress(),
    getAllLearningPaths(),
  ])

  const internProgress = progressResult.success ? progressResult.data ?? [] : []
  const learningPaths = learningPathsResult.success ? learningPathsResult.data ?? [] : []

  // Format data for the table
  const formattedProgress = internProgress.map((ip: any) => ({
    id: ip.id,
    userId: ip.user.id,
    progressPercent: ip.progressPercent,
    startedAt: ip.startedAt?.toISOString?.() ?? ip.startedAt,
    completedAt: ip.completedAt?.toISOString?.() ?? ip.completedAt,
    user: {
      id: ip.user.id,
      firstName: ip.user.firstName,
      lastName: ip.user.lastName,
      email: ip.user.email,
    },
    learningPath: {
      id: ip.learningPath.id,
      title: ip.learningPath.title,
      estimatedDays: ip.learningPath.estimatedDays,
    },
    application: ip.application ? {
      internship: {
        id: ip.application.internship.id,
        title: ip.application.internship.title,
      }
    } : null,
  }))

  // Get unique learning paths for filter
  const learningPathOptions = learningPaths.map((lp: any) => ({
    id: lp.id,
    title: lp.title,
  }))

  return (
    <div className="p-6 lg:p-8">
      <InternProgressDataTable
        data={formattedProgress}
        learningPaths={learningPathOptions}
      />
    </div>
  )
}

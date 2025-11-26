import { getModuleById } from "@/app/actions/learning"
import { NewTaskForm } from "@/components/admin/new-task-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type PageProps = {
  params: Promise<{ id: string; moduleId: string }>
}

export default async function NewTaskPage({ params }: PageProps) {
  const { id, moduleId } = await params
  const result = await getModuleById(moduleId)
  
  if (!result.success || !result.data) {
    return (
      <div className="p-6 lg:p-8">
        <Link href={`/admin/learning-paths/${id}`}>
          <Button variant="ghost" className="mb-4 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Path
          </Button>
        </Link>
        <Card className="p-12 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <p className="text-lg font-semibold">Module not found</p>
          </div>
          <Link href={`/admin/learning-paths/${id}`}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Path
            </Button>
          </Link>
        </Card>
      </div>
    )
  }
  
  const module = result.data
  
  return (
    <NewTaskForm 
      learningPathId={id}
      learningPathTitle={module.learningPath.title}
      moduleId={moduleId}
      moduleTitle={module.title}
    />
  )
}

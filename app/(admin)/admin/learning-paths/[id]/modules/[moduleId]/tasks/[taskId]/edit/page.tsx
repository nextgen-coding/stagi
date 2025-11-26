import { getTaskById } from "@/app/actions/learning"
import { EditTaskForm } from "@/components/admin/edit-task-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

type PageProps = {
  params: Promise<{ id: string; moduleId: string; taskId: string }>
}

export default async function EditTaskPage({ params }: PageProps) {
  const { id, moduleId, taskId } = await params
  const result = await getTaskById(taskId)
  
  if (!result.success || !result.data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/admin/learning-paths/${id}`}>
            <Button variant="ghost" size="icon" className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Task Not Found</h1>
        </div>
        <Card className="p-8 text-center bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400">The task you're looking for doesn't exist or has been deleted.</p>
            <Link href={`/admin/learning-paths/${id}`}>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white mt-2">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Learning Path
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }
  
  const task = result.data
  
  return (
    <EditTaskForm 
      learningPathId={id}
      learningPathTitle={task.module.learningPath.title}
      moduleId={moduleId}
      moduleTitle={task.module.title}
      task={task}
    />
  )
}

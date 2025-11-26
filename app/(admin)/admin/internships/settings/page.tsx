import { getAllDepartments, getAllSkills, getAllCategories } from "@/app/actions/settings"
import { DEPARTMENT_COLORS, DEPARTMENT_ICONS } from "@/lib/settings-constants"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowLeft,
  Settings,
  Building2,
  Sparkles,
  Tag,
} from "lucide-react"
import { DepartmentList } from "@/components/admin/settings/department-list"
import { SkillList } from "@/components/admin/settings/skill-list"
import { CategoryList } from "@/components/admin/settings/category-list"
import { AddDepartmentDialog } from "@/components/admin/settings/add-department-dialog"
import { AddSkillDialog } from "@/components/admin/settings/add-skill-dialog"
import { AddCategoryDialog } from "@/components/admin/settings/add-category-dialog"

export default async function InternshipSettingsPage() {
  const [departmentsResult, skillsResult, categoriesResult] = await Promise.all([
    getAllDepartments(),
    getAllSkills(),
    getAllCategories()
  ])
  
  const departments = departmentsResult.success ? departmentsResult.data ?? [] : []
  const skills = skillsResult.success ? skillsResult.data ?? [] : []
  const categories = categoriesResult.success ? categoriesResult.data ?? [] : []
  
  // Calculate stats
  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter((d: any) => d.isActive).length,
    totalSkills: skills.length,
    activeSkills: skills.filter((s: any) => s.isActive).length,
    totalCategories: categories.length,
    activeCategories: categories.filter((c: any) => c.isActive).length
  }
  
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/internships">
            <Button variant="ghost" className="mb-2 -ml-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Internships
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Internship Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage departments, categories, and skills for your internships
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Departments</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.activeDepartments}<span className="text-sm font-normal text-slate-400">/{stats.totalDepartments}</span>
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-slate-900 border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
              <Tag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {stats.activeCategories}<span className="text-sm font-normal text-slate-400">/{stats.totalCategories}</span>
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Skills</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.activeSkills}<span className="text-sm font-normal text-slate-400">/{stats.totalSkills}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Three Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Departments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Departments</h2>
            </div>
            <AddDepartmentDialog colors={DEPARTMENT_COLORS} icons={DEPARTMENT_ICONS} />
          </div>
          
          <DepartmentList 
            departments={departments} 
            colors={DEPARTMENT_COLORS}
            icons={DEPARTMENT_ICONS}
          />
        </div>
        
        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Categories</h2>
            </div>
            <AddCategoryDialog colors={DEPARTMENT_COLORS} />
          </div>
          
          <CategoryList 
            categories={categories} 
            colors={DEPARTMENT_COLORS}
          />
        </div>
        
        {/* Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skills</h2>
            </div>
            <AddSkillDialog 
              departments={departments} 
              categories={categories}
            />
          </div>
          
          <SkillList 
            skills={skills} 
            departments={departments}
            categories={categories}
          />
        </div>
      </div>
    </div>
  )
}

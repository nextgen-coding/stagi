import { SettingsContent } from './settings-content'
import { 
  getAllDepartments, 
  getAllSkills, 
  getAllCategories 
} from '@/app/actions/settings'
import { DEPARTMENT_COLORS, DEPARTMENT_ICONS } from '@/lib/settings-constants'

export default async function SettingsPage() {
  const [departmentsResult, skillsResult, categoriesResult] = await Promise.all([
    getAllDepartments(),
    getAllSkills(),
    getAllCategories()
  ])

  return (
    <SettingsContent
      departments={departmentsResult.data || []}
      skills={skillsResult.data || []}
      categories={categoriesResult.data || []}
      colors={DEPARTMENT_COLORS}
      icons={DEPARTMENT_ICONS}
    />
  )
}

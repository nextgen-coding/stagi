'use client'

import * as React from 'react'
import {
  Settings,
  Building2,
  Tag,
  FolderTree,
  Briefcase,
  Code,
  Palette,
  Database,
  Server,
  Smartphone,
  LineChart,
  Users,
  Globe,
  Lightbulb,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createSkill,
  updateSkill,
  deleteSkill,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/app/actions/settings'

const iconComponents: Record<string, any> = {
  Briefcase,
  Code,
  Palette,
  Database,
  Server,
  Smartphone,
  LineChart,
  Users,
  Settings,
  Globe,
  Lightbulb,
  Building2,
}

type Department = {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  isActive: boolean
  _count: {
    internships: number
    skills: number
  }
}

type Skill = {
  id: string
  name: string
  description: string | null
  departmentId: string
  categoryId: string | null
  category: string | null
  isActive: boolean
  department: {
    id: string
    name: string
    color: string | null
  }
  categoryRef: {
    id: string
    name: string
    color: string | null
  } | null
  _count: {
    internships: number
  }
}

type Category = {
  id: string
  name: string
  description: string | null
  color: string | null
  isActive: boolean
  _count: {
    skills: number
  }
}

interface SettingsContentProps {
  departments: Department[]
  skills: Skill[]
  categories: Category[]
  colors: readonly { name: string; value: string }[]
  icons: readonly string[]
}

export function SettingsContent({
  departments,
  skills,
  categories,
  colors,
  icons,
}: SettingsContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('departments')

  // Dialog states
  const [addDeptOpen, setAddDeptOpen] = React.useState(false)
  const [editDeptOpen, setEditDeptOpen] = React.useState(false)
  const [addSkillOpen, setAddSkillOpen] = React.useState(false)
  const [editSkillOpen, setEditSkillOpen] = React.useState(false)
  const [addCatOpen, setAddCatOpen] = React.useState(false)
  const [editCatOpen, setEditCatOpen] = React.useState(false)

  // Edit states
  const [editingDept, setEditingDept] = React.useState<Department | null>(null)
  const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null)
  const [editingCat, setEditingCat] = React.useState<Category | null>(null)

  // Form states
  const [deptForm, setDeptForm] = React.useState({ name: '', description: '', color: '#3B82F6', icon: 'Briefcase' })
  const [skillForm, setSkillForm] = React.useState({ name: '', description: '', departmentId: '', categoryId: '' })
  const [catForm, setCatForm] = React.useState({ name: '', description: '', color: '#8B5CF6' })

  // Stats
  const stats = {
    departments: departments.length,
    activeDepartments: departments.filter(d => d.isActive).length,
    skills: skills.length,
    activeSkills: skills.filter(s => s.isActive).length,
    categories: categories.length,
    activeCategories: categories.filter(c => c.isActive).length,
  }

  // Filter data based on search
  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSkills = skills.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Department handlers
  const handleAddDepartment = () => {
    startTransition(async () => {
      const result = await createDepartment(deptForm)
      if (result.success) {
        setAddDeptOpen(false)
        setDeptForm({ name: '', description: '', color: '#3B82F6', icon: 'Briefcase' })
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  const handleEditDepartment = () => {
    if (!editingDept) return
    startTransition(async () => {
      const result = await updateDepartment(editingDept.id, deptForm)
      if (result.success) {
        setEditDeptOpen(false)
        setEditingDept(null)
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  const handleDeleteDepartment = (dept: Department) => {
    if (dept._count.internships > 0) {
      alert(`Cannot delete department with ${dept._count.internships} internship(s).`)
      return
    }
    if (confirm(`Delete "${dept.name}"? This will also delete ${dept._count.skills} skill(s).`)) {
      startTransition(async () => {
        const result = await deleteDepartment(dept.id)
        if (!result.success) alert(result.error)
        router.refresh()
      })
    }
  }

  const handleToggleDeptStatus = (dept: Department) => {
    startTransition(async () => {
      await updateDepartment(dept.id, { isActive: !dept.isActive })
      router.refresh()
    })
  }

  // Skill handlers
  const handleAddSkill = () => {
    startTransition(async () => {
      const result = await createSkill({
        name: skillForm.name,
        description: skillForm.description,
        departmentId: skillForm.departmentId,
        categoryId: skillForm.categoryId || undefined,
      })
      if (result.success) {
        setAddSkillOpen(false)
        setSkillForm({ name: '', description: '', departmentId: '', categoryId: '' })
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  const handleEditSkill = () => {
    if (!editingSkill) return
    startTransition(async () => {
      const result = await updateSkill(editingSkill.id, {
        name: skillForm.name,
        description: skillForm.description,
        departmentId: skillForm.departmentId,
        categoryId: skillForm.categoryId || null,
      })
      if (result.success) {
        setEditSkillOpen(false)
        setEditingSkill(null)
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  const handleDeleteSkill = (skill: Skill) => {
    if (skill._count.internships > 0) {
      alert(`Cannot delete skill assigned to ${skill._count.internships} internship(s).`)
      return
    }
    if (confirm(`Delete "${skill.name}"?`)) {
      startTransition(async () => {
        const result = await deleteSkill(skill.id)
        if (!result.success) alert(result.error)
        router.refresh()
      })
    }
  }

  const handleToggleSkillStatus = (skill: Skill) => {
    startTransition(async () => {
      await updateSkill(skill.id, { isActive: !skill.isActive })
      router.refresh()
    })
  }

  // Category handlers
  const handleAddCategory = () => {
    startTransition(async () => {
      const result = await createCategory(catForm)
      if (result.success) {
        setAddCatOpen(false)
        setCatForm({ name: '', description: '', color: '#8B5CF6' })
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  const handleEditCategory = () => {
    if (!editingCat) return
    startTransition(async () => {
      const result = await updateCategory(editingCat.id, catForm)
      if (result.success) {
        setEditCatOpen(false)
        setEditingCat(null)
        router.refresh()
      } else {
        alert(result.error)
      }
    })
  }

  const handleDeleteCategory = (cat: Category) => {
    if (cat._count.skills > 0) {
      alert(`Cannot delete category with ${cat._count.skills} skill(s).`)
      return
    }
    if (confirm(`Delete "${cat.name}"?`)) {
      startTransition(async () => {
        const result = await deleteCategory(cat.id)
        if (!result.success) alert(result.error)
        router.refresh()
      })
    }
  }

  const handleToggleCatStatus = (cat: Category) => {
    startTransition(async () => {
      await updateCategory(cat.id, { isActive: !cat.isActive })
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex items-center gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-slate-500/25">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage departments, skills & categories
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">{stats.activeDepartments}/{stats.departments}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Tag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{stats.activeSkills}/{stats.skills}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <FolderTree className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{stats.activeCategories}/{stats.categories}</span>
          </div>
        </div>

        <div className="flex-1" />
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 w-full text-sm"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="h-10 px-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="departments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-md px-4">
            <Building2 className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-md px-4">
            <Tag className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-md px-4">
            <FolderTree className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''}
            </p>
            <Dialog open={addDeptOpen} onOpenChange={setAddDeptOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Department</DialogTitle>
                  <DialogDescription>
                    Create a new department to organize internships.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      placeholder="e.g., Engineering"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={deptForm.description}
                      onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Color</Label>
                      <Select value={deptForm.color} onValueChange={(v) => setDeptForm({ ...deptForm, color: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Icon</Label>
                      <Select value={deptForm.icon} onValueChange={(v) => setDeptForm({ ...deptForm, icon: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {icons.map((icon) => {
                            const IconComp = iconComponents[icon] || Briefcase
                            return (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center gap-2">
                                  <IconComp className="h-4 w-4" />
                                  {icon}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDeptOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDepartment} disabled={!deptForm.name || isPending}>
                    {isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3">
            {filteredDepartments.length === 0 ? (
              <Card className="p-8 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <Building2 className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No departments</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {searchQuery ? 'No matching departments found' : 'Create your first department'}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              filteredDepartments.map((dept) => {
                const IconComp = iconComponents[dept.icon || 'Briefcase'] || Briefcase
                return (
                  <Card
                    key={dept.id}
                    className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all hover:shadow-md ${!dept.isActive ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="p-2.5 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${dept.color}20` }}
                        >
                          <IconComp className="w-5 h-5" style={{ color: dept.color || '#3B82F6' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{dept.name}</h3>
                            {!dept.isActive && (
                              <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800">Inactive</Badge>
                            )}
                          </div>
                          {dept.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{dept.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Briefcase className="h-4 w-4" />
                              <span>{dept._count.internships}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Tag className="h-4 w-4" />
                              <span>{dept._count.skills}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingDept(dept)
                                  setDeptForm({
                                    name: dept.name,
                                    description: dept.description || '',
                                    color: dept.color || '#3B82F6',
                                    icon: dept.icon || 'Briefcase',
                                  })
                                  setEditDeptOpen(true)
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleDeptStatus(dept)}>
                                {dept.isActive ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteDepartment(dept)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}
            </p>
            <Dialog open={addSkillOpen} onOpenChange={setAddSkillOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Skill</DialogTitle>
                  <DialogDescription>
                    Create a new skill for internship requirements.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="skillName">Name</Label>
                    <Input
                      id="skillName"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      placeholder="e.g., React.js"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="skillDesc">Description</Label>
                    <Textarea
                      id="skillDesc"
                      value={skillForm.description}
                      onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Department</Label>
                    <Select value={skillForm.departmentId} onValueChange={(v) => setSkillForm({ ...skillForm, departmentId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.filter(d => d.isActive).map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Category (optional)</Label>
                    <Select value={skillForm.categoryId} onValueChange={(v) => setSkillForm({ ...skillForm, categoryId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No category</SelectItem>
                        {categories.filter(c => c.isActive).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddSkillOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSkill} disabled={!skillForm.name || !skillForm.departmentId || isPending}>
                    {isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3">
            {filteredSkills.length === 0 ? (
              <Card className="p-8 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <Tag className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No skills</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {searchQuery ? 'No matching skills found' : 'Create your first skill'}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              filteredSkills.map((skill) => (
                <Card
                  key={skill.id}
                  className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all hover:shadow-md ${!skill.isActive ? 'opacity-60' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-2.5 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${skill.department.color}20` }}
                      >
                        <Tag className="w-5 h-5" style={{ color: skill.department.color || '#10B981' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{skill.name}</h3>
                          {!skill.isActive && (
                            <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs" style={{ borderColor: skill.department.color || '#10B981', color: skill.department.color || '#10B981' }}>
                            {skill.department.name}
                          </Badge>
                          {skill.categoryRef && (
                            <Badge variant="outline" className="text-xs" style={{ borderColor: skill.categoryRef.color || '#8B5CF6', color: skill.categoryRef.color || '#8B5CF6' }}>
                              {skill.categoryRef.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                          <Briefcase className="h-4 w-4" />
                          <span>{skill._count.internships}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSkill(skill)
                                setSkillForm({
                                  name: skill.name,
                                  description: skill.description || '',
                                  departmentId: skill.departmentId,
                                  categoryId: skill.categoryId || '',
                                })
                                setEditSkillOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleSkillStatus(skill)}>
                              {skill.isActive ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteSkill(skill)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredCategories.length} categor{filteredCategories.length !== 1 ? 'ies' : 'y'}
            </p>
            <Dialog open={addCatOpen} onOpenChange={setAddCatOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogDescription>
                    Create a new category to organize skills.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="catName">Name</Label>
                    <Input
                      id="catName"
                      value={catForm.name}
                      onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                      placeholder="e.g., Frontend"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="catDesc">Description</Label>
                    <Textarea
                      id="catDesc"
                      value={catForm.description}
                      onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Color</Label>
                    <Select value={catForm.color} onValueChange={(v) => setCatForm({ ...catForm, color: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddCatOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddCategory} disabled={!catForm.name || isPending}>
                    {isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3">
            {filteredCategories.length === 0 ? (
              <Card className="p-8 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <FolderTree className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No categories</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {searchQuery ? 'No matching categories found' : 'Create your first category'}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              filteredCategories.map((cat) => (
                <Card
                  key={cat.id}
                  className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 transition-all hover:shadow-md ${!cat.isActive ? 'opacity-60' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-2.5 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <FolderTree className="w-5 h-5" style={{ color: cat.color || '#8B5CF6' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{cat.name}</h3>
                          {!cat.isActive && (
                            <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800">Inactive</Badge>
                          )}
                        </div>
                        {cat.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{cat.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                          <Tag className="h-4 w-4" />
                          <span>{cat._count.skills}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingCat(cat)
                                setCatForm({
                                  name: cat.name,
                                  description: cat.description || '',
                                  color: cat.color || '#8B5CF6',
                                })
                                setEditCatOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleCatStatus(cat)}>
                              {cat.isActive ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Department Dialog */}
      <Dialog open={editDeptOpen} onOpenChange={setEditDeptOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editDeptName">Name</Label>
              <Input
                id="editDeptName"
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDeptDesc">Description</Label>
              <Textarea
                id="editDeptDesc"
                value={deptForm.description}
                onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Color</Label>
                <Select value={deptForm.color} onValueChange={(v) => setDeptForm({ ...deptForm, color: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Icon</Label>
                <Select value={deptForm.icon} onValueChange={(v) => setDeptForm({ ...deptForm, icon: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((icon) => {
                      const IconComp = iconComponents[icon] || Briefcase
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            <IconComp className="h-4 w-4" />
                            {icon}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDeptOpen(false)}>Cancel</Button>
            <Button onClick={handleEditDepartment} disabled={!deptForm.name || isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={editSkillOpen} onOpenChange={setEditSkillOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update skill details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editSkillName">Name</Label>
              <Input
                id="editSkillName"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editSkillDesc">Description</Label>
              <Textarea
                id="editSkillDesc"
                value={skillForm.description}
                onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select value={skillForm.departmentId} onValueChange={(v) => setSkillForm({ ...skillForm, departmentId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.filter(d => d.isActive).map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Category (optional)</Label>
              <Select value={skillForm.categoryId} onValueChange={(v) => setSkillForm({ ...skillForm, categoryId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No category</SelectItem>
                  {categories.filter(c => c.isActive).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSkillOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSkill} disabled={!skillForm.name || !skillForm.departmentId || isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editCatOpen} onOpenChange={setEditCatOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editCatName">Name</Label>
              <Input
                id="editCatName"
                value={catForm.name}
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editCatDesc">Description</Label>
              <Textarea
                id="editCatDesc"
                value={catForm.description}
                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <Select value={catForm.color} onValueChange={(v) => setCatForm({ ...catForm, color: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCatOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCategory} disabled={!catForm.name || isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

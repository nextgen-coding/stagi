'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Briefcase, X, Check, ChevronDown, Search, Sparkles, Settings2, Save, MapPin, Clock, FileText, ListChecks, AlertCircle, User, Building2 } from 'lucide-react'
import { updateInternship } from '@/app/actions/internships'

type Department = {
  id: string
  name: string
  color: string | null
  icon: string | null
}

type SkillCategory = {
  id: string
  name: string
  color: string | null
}

type Skill = {
  id: string
  name: string
  departmentId: string
  categoryId: string | null
  categoryRef: SkillCategory | null
  department: {
    id: string
    name: string
    color: string | null
  }
}

type InternshipSkill = {
  skillId: string
  isRequired: boolean
  skill: Skill
}

type Internship = {
  id: string
  title: string
  department: string
  departmentId: string | null
  departmentRef: Department | null
  description: string
  requirements: string | null
  location: string | null
  duration: string | null
  isOpen: boolean
  internshipSkills: InternshipSkill[]
}

type EditInternshipFormProps = {
  internship: Internship
  departments: Department[]
  skills: Skill[]
}

export function EditInternshipForm({ internship, departments, skills }: EditInternshipFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(internship.departmentId || '')
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    internship.internshipSkills?.map(is => is.skillId) || []
  )
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')

  // Get selected department
  const selectedDepartment = departments.find(d => d.id === selectedDepartmentId)

  // Filter skills based on search and selected department
  const filteredSkills = useMemo(() => {
    let filtered = skills.filter(s => s.departmentId === selectedDepartmentId)
    
    if (skillSearch) {
      const searchLower = skillSearch.toLowerCase()
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.categoryRef?.name.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  }, [skills, selectedDepartmentId, skillSearch])

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}
    
    filteredSkills.forEach(skill => {
      const categoryName = skill.categoryRef?.name || 'Other'
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(skill)
    })
    
    // Sort categories alphabetically
    return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredSkills])

  // Get selected skills objects
  const selectedSkills = skills.filter(s => selectedSkillIds.includes(s.id))

  // Toggle skill selection
  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  // Remove skill
  const removeSkill = (skillId: string) => {
    setSelectedSkillIds(prev => prev.filter(id => id !== skillId))
  }

  // Handle department change - clear skills from other departments
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartmentId(deptId)
    setShowDepartmentDropdown(false)
    // Clear skills that don't belong to the new department
    setSelectedSkillIds(prev => prev.filter(skillId => {
      const skill = skills.find(s => s.id === skillId)
      return skill?.departmentId === deptId
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      department: selectedDepartment?.name || formData.get('department') as string,
      departmentId: selectedDepartmentId || undefined,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      location: formData.get('location') as string,
      duration: formData.get('duration') as string,
      isOpen: formData.get('isOpen') === 'true',
      skillIds: selectedSkillIds,
    }
    
    // Validation
    if (!data.title || !data.description) {
      setError('Please fill in all required fields')
      return
    }

    if (!selectedDepartmentId) {
      setError('Please select a department')
      return
    }
    
    startTransition(async () => {
      const result = await updateInternship(internship.id, data)
      
      if (result.success) {
        router.push('/admin/internships')
        router.refresh()
      } else {
        setError(result.error || 'Failed to update internship')
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Single Card with all sections */}
      <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/80 dark:border-slate-700/50 rounded-xl shadow-sm overflow-hidden">
        {/* Status Row - Inline */}
        <div className="px-5 py-3 border-b border-slate-200/80 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
          <div className="flex gap-2">
            <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-sm ${
              internship.isOpen 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}>
              <input type="radio" name="isOpen" value="true" defaultChecked={internship.isOpen} className="sr-only" />
              <div className={`w-2 h-2 rounded-full ${internship.isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              Open
            </label>
            <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all text-sm ${
              !internship.isOpen 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-700' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}>
              <input type="radio" name="isOpen" value="false" defaultChecked={!internship.isOpen} className="sr-only" />
              <div className={`w-2 h-2 rounded-full ${!internship.isOpen ? 'bg-red-500' : 'bg-slate-400'}`} />
              Closed
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-5 space-y-4">
          {/* Row 1: Title + Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={internship.title}
                placeholder="e.g., Software Engineering Intern"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {selectedDepartment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedDepartment.color || '#6B7280' }} />
                    <span className="text-slate-900 dark:text-white">{selectedDepartment.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">Select department</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDepartmentDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-auto">
                  {departments.map(dept => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => handleDepartmentChange(dept.id)}
                      className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color || '#6B7280' }} />
                      <span className="text-slate-900 dark:text-white">{dept.name}</span>
                      {selectedDepartmentId === dept.id && <Check className="w-3.5 h-3.5 text-blue-600 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
              <input type="hidden" name="department" value={selectedDepartment?.name || ''} />
            </div>
          </div>

          {/* Row 2: Location + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Location</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={internship.location || ''}
                placeholder="e.g., Remote, San Francisco"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Duration</span>
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                defaultValue={internship.duration || ''}
                placeholder="e.g., 3 months"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Skills
              </label>
              <span className="text-xs text-slate-400">First 3 = Required</span>
            </div>
            
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedSkills.map((skill, index) => (
                  <Badge 
                    key={skill.id}
                    variant="outline"
                    className="px-2 py-0.5 text-xs rounded-md flex items-center gap-1"
                    style={{ 
                      backgroundColor: `${skill.categoryRef?.color || '#6B7280'}10`,
                      borderColor: `${skill.categoryRef?.color || '#6B7280'}40`,
                      color: skill.categoryRef?.color || '#6B7280'
                    }}
                  >
                    {index < 3 && <span>★</span>}
                    {skill.name}
                    <button type="button" onClick={() => removeSkill(skill.id)} className="ml-0.5 hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (!selectedDepartmentId) { setError('Select a department first'); return }
                  setShowSkillsDropdown(!showSkillsDropdown)
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-left flex items-center justify-between text-sm"
              >
                <span className="text-slate-400">
                  {selectedSkillIds.length > 0 ? `${selectedSkillIds.length} selected` : 'Add skills...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSkillsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showSkillsDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-auto p-2">
                    {skillsByCategory.length === 0 ? (
                      <div className="p-3 text-center text-sm text-slate-400">No skills found</div>
                    ) : (
                      skillsByCategory.map(([categoryName, categorySkills]) => (
                        <div key={categoryName} className="mb-2 last:mb-0">
                          <div className="px-2 py-1 text-xs font-medium text-slate-400 uppercase">{categoryName}</div>
                          {categorySkills.map(skill => {
                            const isSelected = selectedSkillIds.includes(skill.id)
                            return (
                              <button
                                key={skill.id}
                                type="button"
                                onClick={() => toggleSkill(skill.id)}
                                className={`w-full px-2 py-1.5 rounded text-left text-sm flex items-center justify-between ${
                                  isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.categoryRef?.color || '#6B7280' }} />
                                  {skill.name}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                              </button>
                            )
                          })}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowSkillsDropdown(false)} className="w-full text-xs">
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description + Requirements in 2 columns on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                defaultValue={internship.description}
                placeholder="Describe the role and responsibilities..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={5}
                defaultValue={internship.requirements || ''}
                placeholder="List qualifications and experience..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-5 py-3 border-t border-slate-200/80 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
          <Link href="/admin/internships">
            <Button type="button" variant="ghost" size="sm" disabled={isPending} className="text-slate-600 dark:text-slate-400">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-sm gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </form>
  )
}

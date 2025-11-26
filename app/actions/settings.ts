'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============== DEPARTMENTS ==============

export async function getAllDepartments() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            internships: true,
            skills: true
          }
        }
      }
    })
    return { success: true, data: departments }
  } catch (error) {
    console.error('Error fetching departments:', error)
    return { success: false, error: 'Failed to fetch departments' }
  }
}

export async function getActiveDepartments() {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { success: true, data: departments }
  } catch (error) {
    console.error('Error fetching active departments:', error)
    return { success: false, error: 'Failed to fetch departments' }
  }
}

export async function getDepartmentById(id: string) {
  try {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        skills: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            internships: true,
            skills: true
          }
        }
      }
    })
    if (!department) {
      return { success: false, error: 'Department not found' }
    }
    return { success: true, data: department }
  } catch (error) {
    console.error('Error fetching department:', error)
    return { success: false, error: 'Failed to fetch department' }
  }
}

export async function createDepartment(data: {
  name: string
  description?: string
  color?: string
  icon?: string
}) {
  try {
    // Check if department with same name exists
    const existing = await prisma.department.findUnique({
      where: { name: data.name }
    })
    if (existing) {
      return { success: false, error: 'A department with this name already exists' }
    }

    const department = await prisma.department.create({
      data: {
        name: data.name,
        description: data.description || null,
        color: data.color || '#3B82F6',
        icon: data.icon || 'Briefcase'
      }
    })
    revalidatePath('/admin/internships/settings')
    return { success: true, data: department }
  } catch (error) {
    console.error('Error creating department:', error)
    return { success: false, error: 'Failed to create department' }
  }
}

export async function updateDepartment(id: string, data: {
  name?: string
  description?: string
  color?: string
  icon?: string
  isActive?: boolean
}) {
  try {
    // Check if name is being changed and if new name already exists
    if (data.name) {
      const existing = await prisma.department.findFirst({
        where: { 
          name: data.name,
          NOT: { id }
        }
      })
      if (existing) {
        return { success: false, error: 'A department with this name already exists' }
      }
    }

    const department = await prisma.department.update({
      where: { id },
      data
    })
    revalidatePath('/admin/internships/settings')
    return { success: true, data: department }
  } catch (error) {
    console.error('Error updating department:', error)
    return { success: false, error: 'Failed to update department' }
  }
}

export async function deleteDepartment(id: string) {
  try {
    // Check if department has internships
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        _count: {
          select: { internships: true, skills: true }
        }
      }
    })

    if (!department) {
      return { success: false, error: 'Department not found' }
    }

    if (department._count.internships > 0) {
      return { success: false, error: `Cannot delete department with ${department._count.internships} internship(s). Please reassign them first.` }
    }

    // Delete will cascade to skills
    await prisma.department.delete({ where: { id } })
    revalidatePath('/admin/internships/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting department:', error)
    return { success: false, error: 'Failed to delete department' }
  }
}

// ============== SKILLS ==============

export async function getAllSkills() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ department: { name: 'asc' } }, { name: 'asc' }],
      include: {
        department: true,
        categoryRef: true,
        _count: {
          select: { internships: true }
        }
      }
    })
    return { success: true, data: skills }
  } catch (error) {
    console.error('Error fetching skills:', error)
    return { success: false, error: 'Failed to fetch skills' }
  }
}

export async function getSkillsByDepartment(departmentId: string) {
  try {
    const skills = await prisma.skill.findMany({
      where: { departmentId, isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { internships: true }
        }
      }
    })
    return { success: true, data: skills }
  } catch (error) {
    console.error('Error fetching skills:', error)
    return { success: false, error: 'Failed to fetch skills' }
  }
}

export async function getSkillById(id: string) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        department: true,
        _count: {
          select: { internships: true }
        }
      }
    })
    if (!skill) {
      return { success: false, error: 'Skill not found' }
    }
    return { success: true, data: skill }
  } catch (error) {
    console.error('Error fetching skill:', error)
    return { success: false, error: 'Failed to fetch skill' }
  }
}

export async function createSkill(data: {
  name: string
  description?: string
  departmentId: string
  categoryId?: string
  category?: string
}) {
  try {
    // Check if skill with same name exists in same department
    const existing = await prisma.skill.findFirst({
      where: { 
        name: data.name,
        departmentId: data.departmentId
      }
    })
    if (existing) {
      return { success: false, error: 'A skill with this name already exists in this department' }
    }

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        description: data.description || null,
        departmentId: data.departmentId,
        categoryId: data.categoryId || null,
        category: data.category || null
      },
      include: {
        department: true,
        categoryRef: true
      }
    })
    revalidatePath('/admin/internships/settings')
    return { success: true, data: skill }
  } catch (error) {
    console.error('Error creating skill:', error)
    return { success: false, error: 'Failed to create skill' }
  }
}

export async function updateSkill(id: string, data: {
  name?: string
  description?: string
  departmentId?: string
  categoryId?: string | null
  category?: string
  isActive?: boolean
}) {
  try {
    // Check if name+department combo already exists
    if (data.name || data.departmentId) {
      const currentSkill = await prisma.skill.findUnique({ where: { id } })
      if (!currentSkill) {
        return { success: false, error: 'Skill not found' }
      }

      const existing = await prisma.skill.findFirst({
        where: { 
          name: data.name || currentSkill.name,
          departmentId: data.departmentId || currentSkill.departmentId,
          NOT: { id }
        }
      })
      if (existing) {
        return { success: false, error: 'A skill with this name already exists in this department' }
      }
    }

    const skill = await prisma.skill.update({
      where: { id },
      data,
      include: {
        department: true,
        categoryRef: true
      }
    })
    revalidatePath('/admin/internships/settings')
    return { success: true, data: skill }
  } catch (error) {
    console.error('Error updating skill:', error)
    return { success: false, error: 'Failed to update skill' }
  }
}

export async function deleteSkill(id: string) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        _count: {
          select: { internships: true }
        }
      }
    })

    if (!skill) {
      return { success: false, error: 'Skill not found' }
    }

    if (skill._count.internships > 0) {
      return { success: false, error: `Cannot delete skill assigned to ${skill._count.internships} internship(s). Please remove assignments first.` }
    }

    await prisma.skill.delete({ where: { id } })
    revalidatePath('/admin/internships/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting skill:', error)
    return { success: false, error: 'Failed to delete skill' }
  }
}

// ============== INTERNSHIP SKILLS ==============

export async function getInternshipSkills(internshipId: string) {
  try {
    const skills = await prisma.internshipSkill.findMany({
      where: { internshipId },
      include: {
        skill: {
          include: {
            department: true
          }
        }
      },
      orderBy: [
        { isRequired: 'desc' },
        { skill: { name: 'asc' } }
      ]
    })
    return { success: true, data: skills }
  } catch (error) {
    console.error('Error fetching internship skills:', error)
    return { success: false, error: 'Failed to fetch internship skills' }
  }
}

export async function addSkillToInternship(internshipId: string, skillId: string, isRequired: boolean = true) {
  try {
    const existing = await prisma.internshipSkill.findUnique({
      where: {
        internshipId_skillId: { internshipId, skillId }
      }
    })
    if (existing) {
      return { success: false, error: 'Skill already assigned to this internship' }
    }

    const internshipSkill = await prisma.internshipSkill.create({
      data: {
        internshipId,
        skillId,
        isRequired
      },
      include: {
        skill: {
          include: {
            department: true
          }
        }
      }
    })
    revalidatePath('/admin/internships')
    return { success: true, data: internshipSkill }
  } catch (error) {
    console.error('Error adding skill to internship:', error)
    return { success: false, error: 'Failed to add skill' }
  }
}

export async function removeSkillFromInternship(internshipId: string, skillId: string) {
  try {
    await prisma.internshipSkill.delete({
      where: {
        internshipId_skillId: { internshipId, skillId }
      }
    })
    revalidatePath('/admin/internships')
    return { success: true }
  } catch (error) {
    console.error('Error removing skill from internship:', error)
    return { success: false, error: 'Failed to remove skill' }
  }
}

export async function updateInternshipSkill(internshipId: string, skillId: string, isRequired: boolean) {
  try {
    const internshipSkill = await prisma.internshipSkill.update({
      where: {
        internshipId_skillId: { internshipId, skillId }
      },
      data: { isRequired }
    })
    revalidatePath('/admin/internships')
    return { success: true, data: internshipSkill }
  } catch (error) {
    console.error('Error updating internship skill:', error)
    return { success: false, error: 'Failed to update skill' }
  }
}

// ============== SKILL CATEGORIES ==============

export async function getAllCategories() {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { skills: true }
        }
      }
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function getActiveCategories() {
  try {
    const categories = await prisma.skillCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { success: true, data: categories }
  } catch (error) {
    console.error('Error fetching active categories:', error)
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function createCategory(data: {
  name: string
  description?: string
  color?: string
}) {
  try {
    // Check if category with same name exists
    const existing = await prisma.skillCategory.findUnique({
      where: { name: data.name }
    })
    if (existing) {
      return { success: false, error: 'A category with this name already exists' }
    }

    const category = await prisma.skillCategory.create({
      data: {
        name: data.name,
        description: data.description || null,
        color: data.color || '#8B5CF6'
      }
    })
    revalidatePath('/admin/internships/settings')
    return { success: true, data: category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateCategory(id: string, data: {
  name?: string
  description?: string
  color?: string
  isActive?: boolean
}) {
  try {
    // Check if name is being changed and if new name already exists
    if (data.name) {
      const existing = await prisma.skillCategory.findFirst({
        where: { 
          name: data.name,
          NOT: { id }
        }
      })
      if (existing) {
        return { success: false, error: 'A category with this name already exists' }
      }
    }

    const category = await prisma.skillCategory.update({
      where: { id },
      data
    })
    revalidatePath('/admin/internships/settings')
    return { success: true, data: category }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.skillCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { skills: true }
        }
      }
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    if (category._count.skills > 0) {
      return { success: false, error: `Cannot delete category with ${category._count.skills} skill(s). Please reassign them first.` }
    }

    await prisma.skillCategory.delete({ where: { id } })
    revalidatePath('/admin/internships/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

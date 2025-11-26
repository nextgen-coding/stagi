'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Get all internships (admin only)
export async function getAllInternships() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Admin access required' }
    }
    
    const internships = await prisma.internship.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })
    
    return { success: true, data: internships }
  } catch (error) {
    console.error('Error fetching internships:', error)
    return { success: false, error: 'Failed to fetch internships' }
  }
}

// Get all open internships (public)
export async function getOpenInternships() {
  try {
    const internships = await prisma.internship.findMany({
      where: { isOpen: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        department: true,
        description: true,
        location: true,
        duration: true,
        createdAt: true,
        _count: {
          select: { applications: true }
        }
      }
    })
    
    return { success: true, data: internships }
  } catch (error) {
    console.error('Error fetching internships:', error)
    return { success: false, error: 'Failed to fetch internships' }
  }
}

// Get internship by ID (public)
export async function getInternshipById(id: string) {
  try {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        departmentRef: true,
        internshipSkills: {
          include: {
            skill: {
              include: {
                categoryRef: true,
                department: true
              }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    })
    
    if (!internship) {
      return { success: false, error: 'Internship not found' }
    }
    
    return { success: true, data: internship }
  } catch (error) {
    console.error('Error fetching internship:', error)
    return { success: false, error: 'Failed to fetch internship' }
  }
}

// Create a new internship (admin only)
export async function createInternship(data: {
  title: string
  department: string
  description: string
  requirements?: string
  location?: string
  duration?: string
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Admin access required' }
    }
    
    const internship = await prisma.internship.create({
      data
    })
    
    return { success: true, data: internship }
  } catch (error) {
    console.error('Error creating internship:', error)
    return { success: false, error: 'Failed to create internship' }
  }
}

// Update internship (admin only)
export async function updateInternship(id: string, data: Partial<{
  title: string
  department: string
  departmentId: string
  description: string
  requirements: string
  location: string
  duration: string
  isOpen: boolean
  skillIds: string[]
}>) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Admin access required' }
    }

    // Extract skillIds from data
    const { skillIds, ...internshipData } = data

    // Update the internship
    const internship = await prisma.internship.update({
      where: { id },
      data: internshipData
    })

    // Update skills if provided
    if (skillIds !== undefined) {
      // Remove existing skill links
      await prisma.internshipSkill.deleteMany({
        where: { internshipId: id }
      })

      // Add new skill links
      if (skillIds.length > 0) {
        await prisma.internshipSkill.createMany({
          data: skillIds.map((skillId, index) => ({
            internshipId: id,
            skillId,
            isRequired: index < 3 // First 3 skills are required
          }))
        })
      }
    }
    
    return { success: true, data: internship }
  } catch (error) {
    console.error('Error updating internship:', error)
    return { success: false, error: 'Failed to update internship' }
  }
}

// Delete internship (admin only)
export async function deleteInternship(id: string) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Admin access required' }
    }
    
    // Check if internship has applications
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })
    
    if (!internship) {
      return { success: false, error: 'Internship not found' }
    }
    
    if (internship._count.applications > 0) {
      return { success: false, error: 'Cannot delete internship with applications. Close it instead.' }
    }
    
    await prisma.internship.delete({
      where: { id }
    })
    
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Error deleting internship:', error)
    return { success: false, error: 'Failed to delete internship' }
  }
}

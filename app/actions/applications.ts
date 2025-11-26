'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'

// Get user's applications
export async function getUserApplications() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        internship: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
            duration: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    })
    
    return { success: true, data: applications }
  } catch (error) {
    console.error('Error fetching user applications:', error)
    return { success: false, error: 'Failed to fetch applications' }
  }
}

// Submit application
export async function submitApplication(data: {
  internshipId: string
  fullName: string
  email: string
  phone: string
  education: string
  experience: string
  whyInterested: string
  availability: string
  resumeUrl?: string
  coverLetter?: string
  linkedinUrl?: string
  githubUrl?: string
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await auth()
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.sessionClaims?.email as string || '',
          firstName: clerkUser.sessionClaims?.firstName as string || '',
          lastName: clerkUser.sessionClaims?.lastName as string || '',
          role: 'CANDIDATE'
        }
      })
    }
    
    // Check if user already applied to this internship
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
        internshipId: data.internshipId
      }
    })
    
    if (existingApplication) {
      return { success: false, error: 'You have already applied to this internship' }
    }
    
    // Create application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        internshipId: data.internshipId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        education: data.education,
        experience: data.experience,
        whyInterested: data.whyInterested,
        availability: data.availability,
        resumeUrl: data.resumeUrl,
        coverLetter: data.coverLetter,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        status: 'PENDING'
      },
      include: {
        internship: {
          select: {
            title: true,
            department: true
          }
        }
      }
    })
    
    return { success: true, data: application }
  } catch (error) {
    console.error('Error submitting application:', error)
    return { success: false, error: 'Failed to submit application' }
  }
}

// Get all applications (admin only)
export async function getAllApplications(filters?: {
  status?: ApplicationStatus
  internshipId?: string
}) {
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
    
    const applications = await prisma.application.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.internshipId && { internshipId: filters.internshipId })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        internship: {
          select: {
            id: true,
            title: true,
            department: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    })
    
    return { success: true, data: applications }
  } catch (error) {
    console.error('Error fetching applications:', error)
    return { success: false, error: 'Failed to fetch applications' }
  }
}

// Update application status (admin only)
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
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
    
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        internship: {
          select: {
            title: true,
            department: true
          }
        }
      }
    })
    
    return { success: true, data: application }
  } catch (error) {
    console.error('Error updating application status:', error)
    return { success: false, error: 'Failed to update application status' }
  }
}

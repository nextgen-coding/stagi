'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function syncUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (existingUser) {
      return { success: true, data: existingUser }
    }
    
    // Get user details from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return { success: false, error: 'User not found in Clerk' }
    }
    
    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        role: 'CANDIDATE' // Default role
      }
    })
    
    return { success: true, data: newUser }
  } catch (error) {
    console.error('Error syncing user:', error)
    return { success: false, error: 'Failed to sync user' }
  }
}

export async function updateUserRole(clerkId: string, role: 'ADMIN' | 'CANDIDATE') {
  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: { role }
    })
    
    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: 'Failed to update user role' }
  }
}

export async function getCurrentUser() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Sync user if not exists
    const syncResult = await syncUser()
    
    if (!syncResult.success) {
      return syncResult
    }
    
    return { success: true, data: syncResult.data }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { success: false, error: 'Failed to get current user' }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        },
        applications: {
          take: 5,
          orderBy: { appliedAt: 'desc' },
          include: {
            internship: {
              select: { title: true }
            }
          }
        }
      }
    })
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    // Serialize dates to strings for client components
    const serializedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      applications: user.applications.map(app => ({
        ...app,
        appliedAt: app.appliedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString()
      }))
    }
    
    return { success: true, data: serializedUser }
  } catch (error) {
    console.error('Error getting user:', error)
    return { success: false, error: 'Failed to get user' }
  }
}

export async function updateUser(id: string, data: {
  firstName?: string
  lastName?: string
  role?: 'ADMIN' | 'CANDIDATE' | 'INTERN'
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Not authenticated' }
    }
    
    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Not authorized' }
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      }
    })
    
    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function updateCurrentUserProfile(data: {
  firstName?: string
  lastName?: string
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName
      }
    })
    
    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function getCurrentUserWithStats() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        _count: {
          select: { 
            applications: true,
            taskProgress: true 
          }
        },
        applications: {
          take: 3,
          orderBy: { appliedAt: 'desc' },
          include: {
            internship: {
              include: {
                departmentRef: true
              }
            }
          }
        }
      }
    })
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    // Serialize dates to strings for client components
    const serializedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      applications: user.applications.map(app => ({
        ...app,
        appliedAt: app.appliedAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        internship: {
          ...app.internship,
          createdAt: app.internship.createdAt.toISOString(),
          updatedAt: app.internship.updatedAt.toISOString(),
          departmentRef: app.internship.departmentRef ? {
            ...app.internship.departmentRef,
            createdAt: app.internship.departmentRef.createdAt.toISOString(),
            updatedAt: app.internship.departmentRef.updatedAt.toISOString()
          } : null
        }
      }))
    }
    
    return { success: true, data: serializedUser }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return { success: false, error: 'Failed to get user stats' }
  }
}

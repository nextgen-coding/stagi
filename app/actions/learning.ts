'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/lib/types'

// ==================== LEARNING PATH ACTIONS ====================

// Get all learning paths (admin only)
export async function getAllLearningPaths(): Promise<ActionResponse<any[]>> {
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
    
    const learningPaths = await prisma.learningPath.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        internship: {
          select: { id: true, title: true }
        },
        modules: {
          select: { id: true }
        },
        internProgress: {
          select: { id: true, progressPercent: true }
        },
        _count: {
          select: {
            modules: true,
            internProgress: true
          }
        }
      }
    })
    
    return { success: true, data: learningPaths }
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return { success: false, error: 'Failed to fetch learning paths' }
  }
}

// Get learning path by ID
export async function getLearningPathById(id: string): Promise<ActionResponse<any>> {
  try {
    const learningPath = await prisma.learningPath.findUnique({
      where: { id },
      include: {
        internship: {
          select: { id: true, title: true }
        },
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            tasks: {
              orderBy: { orderIndex: 'asc' },
              include: {
                contents: {
                  orderBy: { orderIndex: 'asc' }
                },
                submissionRequirement: true
              }
            }
          }
        }
      }
    })
    
    if (!learningPath) {
      return { success: false, error: 'Learning path not found' }
    }
    
    return { success: true, data: learningPath }
  } catch (error) {
    console.error('Error fetching learning path:', error)
    return { success: false, error: 'Failed to fetch learning path' }
  }
}

// Create learning path (admin only)
export async function createLearningPath(data: {
  title: string
  description: string
  internshipId?: string
  estimatedDays?: number
}): Promise<ActionResponse<any>> {
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
    
    const learningPath = await prisma.learningPath.create({
      data: {
        title: data.title,
        description: data.description,
        internshipId: data.internshipId || null,
        estimatedDays: data.estimatedDays || null
      }
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: learningPath }
  } catch (error) {
    console.error('Error creating learning path:', error)
    return { success: false, error: 'Failed to create learning path' }
  }
}

// Update learning path (admin only)
export async function updateLearningPath(id: string, data: Partial<{
  title: string
  description: string
  internshipId: string | null
  isActive: boolean
  estimatedDays: number | null
}>): Promise<ActionResponse<any>> {
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
    
    const learningPath = await prisma.learningPath.update({
      where: { id },
      data
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: learningPath }
  } catch (error) {
    console.error('Error updating learning path:', error)
    return { success: false, error: 'Failed to update learning path' }
  }
}

// Delete learning path (admin only)
export async function deleteLearningPath(id: string): Promise<ActionResponse<{ id: string }>> {
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
    
    // Check if learning path has active interns
    const progressCount = await prisma.internProgress.count({
      where: { 
        learningPathId: id,
        completedAt: null
      }
    })
    
    if (progressCount > 0) {
      return { success: false, error: 'Cannot delete learning path with active interns. Archive it instead.' }
    }
    
    await prisma.learningPath.delete({
      where: { id }
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Error deleting learning path:', error)
    return { success: false, error: 'Failed to delete learning path' }
  }
}

// ==================== MODULE ACTIONS ====================

// Create module (admin only)
export async function createModule(data: {
  learningPathId: string
  title: string
  description: string
  estimatedHours?: number
}): Promise<ActionResponse<any>> {
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
    
    // Get the next order index
    const lastModule = await prisma.module.findFirst({
      where: { learningPathId: data.learningPathId },
      orderBy: { orderIndex: 'desc' }
    })
    
    const module = await prisma.module.create({
      data: {
        learningPathId: data.learningPathId,
        title: data.title,
        description: data.description,
        estimatedHours: data.estimatedHours || null,
        orderIndex: (lastModule?.orderIndex ?? -1) + 1
      }
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: module }
  } catch (error) {
    console.error('Error creating module:', error)
    return { success: false, error: 'Failed to create module' }
  }
}

// Update module (admin only)
export async function updateModule(id: string, data: Partial<{
  title: string
  description: string
  estimatedHours: number | null
  orderIndex: number
}>): Promise<ActionResponse<any>> {
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
    
    const module = await prisma.module.update({
      where: { id },
      data
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: module }
  } catch (error) {
    console.error('Error updating module:', error)
    return { success: false, error: 'Failed to update module' }
  }
}

// Delete module (admin only)
export async function deleteModule(id: string): Promise<ActionResponse<{ id: string }>> {
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
    
    await prisma.module.delete({
      where: { id }
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Error deleting module:', error)
    return { success: false, error: 'Failed to delete module' }
  }
}

// ==================== TASK ACTIONS ====================

// Create task (admin only)
export async function createTask(data: {
  moduleId: string
  title: string
  description: string
  isRequired?: boolean
  estimatedMinutes?: number
}): Promise<ActionResponse<any>> {
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
    
    // Get the next order index
    const lastTask = await prisma.task.findFirst({
      where: { moduleId: data.moduleId },
      orderBy: { orderIndex: 'desc' }
    })
    
    const task = await prisma.task.create({
      data: {
        moduleId: data.moduleId,
        title: data.title,
        description: data.description,
        isRequired: data.isRequired ?? true,
        estimatedMinutes: data.estimatedMinutes || null,
        orderIndex: (lastTask?.orderIndex ?? -1) + 1
      }
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: task }
  } catch (error) {
    console.error('Error creating task:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

// Update task (admin only)
export async function updateTask(id: string, data: Partial<{
  title: string
  description: string
  isRequired: boolean
  estimatedMinutes: number | null
  orderIndex: number
}>): Promise<ActionResponse<any>> {
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
    
    const task = await prisma.task.update({
      where: { id },
      data
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: task }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: 'Failed to update task' }
  }
}

// Delete task (admin only)
export async function deleteTask(id: string): Promise<ActionResponse<{ id: string }>> {
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
    
    await prisma.task.delete({
      where: { id }
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: 'Failed to delete task' }
  }
}

// ==================== PROGRESS ACTIONS ====================

// Assign learning path to intern (admin only - used when accepting application)
export async function assignLearningPath(data: {
  userId: string
  learningPathId: string
  applicationId?: string
}): Promise<ActionResponse<any>> {
  try {
    const { userId: adminId } = await auth()
    
    if (!adminId) {
      return { success: false, error: 'Unauthorized' }
    }
    
    const admin = await prisma.user.findUnique({
      where: { clerkId: adminId }
    })
    
    if (!admin || admin.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Admin access required' }
    }
    
    // Check if already assigned
    const existing = await prisma.internProgress.findUnique({
      where: {
        userId_learningPathId: {
          userId: data.userId,
          learningPathId: data.learningPathId
        }
      }
    })
    
    if (existing) {
      return { success: false, error: 'Learning path already assigned to this intern' }
    }
    
    // Get the first module to set as current
    const firstModule = await prisma.module.findFirst({
      where: { learningPathId: data.learningPathId },
      orderBy: { orderIndex: 'asc' }
    })
    
    const internProgress = await prisma.internProgress.create({
      data: {
        userId: data.userId,
        learningPathId: data.learningPathId,
        applicationId: data.applicationId || null,
        currentModuleId: firstModule?.id || null
      }
    })
    
    revalidatePath('/admin/progress')
    return { success: true, data: internProgress }
  } catch (error) {
    console.error('Error assigning learning path:', error)
    return { success: false, error: 'Failed to assign learning path' }
  }
}

// Get intern's learning progress
export async function getMyLearningProgress(): Promise<ActionResponse<any>> {
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
    
    const progress = await prisma.internProgress.findMany({
      where: { userId: user.id },
      include: {
        learningPath: {
          include: {
            modules: {
              orderBy: { orderIndex: 'asc' },
              include: {
                tasks: {
                  orderBy: { orderIndex: 'asc' },
                  include: {
                    contents: {
                      orderBy: { orderIndex: 'asc' }
                    },
                    submissionRequirement: true,
                    submissions: {
                      where: { userId: user.id }
                    },
                    taskProgress: {
                      where: { userId: user.id }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    
    return { success: true, data: progress }
  } catch (error) {
    console.error('Error fetching learning progress:', error)
    return { success: false, error: 'Failed to fetch learning progress' }
  }
}

// Mark task as complete (intern)
export async function completeTask(taskId: string, notes?: string, timeSpentMinutes?: number): Promise<ActionResponse<any>> {
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
    
    // Create or update task progress
    const taskProgress = await prisma.taskProgress.upsert({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId: taskId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        notes: notes || null,
        timeSpentMinutes: timeSpentMinutes || null
      },
      create: {
        userId: user.id,
        taskId: taskId,
        isCompleted: true,
        completedAt: new Date(),
        notes: notes || null,
        timeSpentMinutes: timeSpentMinutes || null
      }
    })
    
    // Update overall progress percentage
    await updateProgressPercentage(user.id)
    
    revalidatePath('/dashboard/learning')
    return { success: true, data: taskProgress }
  } catch (error) {
    console.error('Error completing task:', error)
    return { success: false, error: 'Failed to complete task' }
  }
}

// Mark task as incomplete (intern)
export async function uncompleteTask(taskId: string): Promise<ActionResponse<any>> {
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
    
    const taskProgress = await prisma.taskProgress.update({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId: taskId
        }
      },
      data: {
        isCompleted: false,
        completedAt: null
      }
    })
    
    // Update overall progress percentage
    await updateProgressPercentage(user.id)
    
    revalidatePath('/dashboard/learning')
    return { success: true, data: taskProgress }
  } catch (error) {
    console.error('Error uncompleting task:', error)
    return { success: false, error: 'Failed to uncomplete task' }
  }
}

// Helper function to calculate and update progress percentage
async function updateProgressPercentage(userId: string) {
  const internProgress = await prisma.internProgress.findMany({
    where: { userId },
    include: {
      learningPath: {
        include: {
          modules: {
            include: {
              tasks: true
            }
          }
        }
      }
    }
  })
  
  for (const progress of internProgress) {
    const allTasks = progress.learningPath.modules.flatMap(m => m.tasks)
    const totalTasks = allTasks.length
    
    if (totalTasks === 0) continue
    
    const completedTasks = await prisma.taskProgress.count({
      where: {
        userId: userId,
        isCompleted: true,
        taskId: {
          in: allTasks.map(t => t.id)
        }
      }
    })
    
    const progressPercent = Math.round((completedTasks / totalTasks) * 100)
    const isComplete = progressPercent === 100
    
    await prisma.internProgress.update({
      where: { id: progress.id },
      data: {
        progressPercent,
        completedAt: isComplete && !progress.completedAt ? new Date() : progress.completedAt
      }
    })
  }
}

// Get all intern progress (admin only)
export async function getAllInternProgress(): Promise<ActionResponse<any[]>> {
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
    
    const progress = await prisma.internProgress.findMany({
      orderBy: { startedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        learningPath: {
          select: {
            id: true,
            title: true,
            estimatedDays: true
          }
        },
        application: {
          include: {
            internship: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })
    
    return { success: true, data: progress }
  } catch (error) {
    console.error('Error fetching intern progress:', error)
    return { success: false, error: 'Failed to fetch intern progress' }
  }
}

// ==================== TASK CONTENT ACTIONS ====================

export type TaskContentType = 'TEXT' | 'VIDEO' | 'PDF' | 'IMAGE' | 'LINK' | 'CODE'

export interface TaskContentData {
  contentType: TaskContentType
  orderIndex: number
  textContent?: string
  videoUrl?: string
  fileUrl?: string
  fileName?: string
  linkUrl?: string
  linkTitle?: string
}

// Create task with contents (admin only)
export async function createTaskWithContents(data: {
  moduleId: string
  title: string
  description: string
  isRequired?: boolean
  estimatedMinutes?: number
  contents: TaskContentData[]
  submission?: {
    submissionType: string
    instructions?: string
    isRequired?: boolean
  }
}): Promise<ActionResponse<any>> {
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
    
    // Get the next order index
    const lastTask = await prisma.task.findFirst({
      where: { moduleId: data.moduleId },
      orderBy: { orderIndex: 'desc' }
    })
    
    // Create task with contents in a transaction
    const task = await prisma.$transaction(async (tx) => {
      const newTask = await tx.task.create({
        data: {
          moduleId: data.moduleId,
          title: data.title,
          description: data.description,
          isRequired: data.isRequired ?? true,
          estimatedMinutes: data.estimatedMinutes || null,
          orderIndex: (lastTask?.orderIndex ?? -1) + 1
        }
      })
      
      // Create content blocks
      if (data.contents.length > 0) {
        await tx.taskContent.createMany({
          data: data.contents.map((content, index) => ({
            taskId: newTask.id,
            contentType: content.contentType,
            orderIndex: index,
            textContent: content.textContent || null,
            videoUrl: content.videoUrl || null,
            fileUrl: content.fileUrl || null,
            fileName: content.fileName || null,
            linkUrl: content.linkUrl || null,
            linkTitle: content.linkTitle || null
          }))
        })
      }
      
      // Create submission requirement if provided
      if (data.submission) {
        await tx.taskSubmissionRequirement.create({
          data: {
            taskId: newTask.id,
            submissionType: data.submission.submissionType as any,
            instructions: data.submission.instructions || null,
            isRequired: data.submission.isRequired ?? true
          }
        })
      }
      
      return tx.task.findUnique({
        where: { id: newTask.id },
        include: { 
          contents: { orderBy: { orderIndex: 'asc' } },
          submissionRequirement: true
        }
      })
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: task }
  } catch (error) {
    console.error('Error creating task with contents:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

// Update task with contents (admin only)
export async function updateTaskWithContents(id: string, data: {
  title: string
  description: string
  isRequired?: boolean
  estimatedMinutes?: number | null
  contents: TaskContentData[]
  submission?: {
    submissionType: string
    instructions?: string
    isRequired?: boolean
  } | null
}): Promise<ActionResponse<any>> {
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
    
    // Update task and replace contents in a transaction
    const task = await prisma.$transaction(async (tx) => {
      // Update task details
      await tx.task.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          isRequired: data.isRequired ?? true,
          estimatedMinutes: data.estimatedMinutes
        }
      })
      
      // Delete existing contents
      await tx.taskContent.deleteMany({
        where: { taskId: id }
      })
      
      // Create new contents
      if (data.contents.length > 0) {
        await tx.taskContent.createMany({
          data: data.contents.map((content, index) => ({
            taskId: id,
            contentType: content.contentType,
            orderIndex: index,
            textContent: content.textContent || null,
            videoUrl: content.videoUrl || null,
            fileUrl: content.fileUrl || null,
            fileName: content.fileName || null,
            linkUrl: content.linkUrl || null,
            linkTitle: content.linkTitle || null
          }))
        })
      }
      
      // Delete existing submission requirement
      await tx.taskSubmissionRequirement.deleteMany({
        where: { taskId: id }
      })
      
      // Create new submission requirement if provided
      if (data.submission && data.submission.submissionType !== 'NONE') {
        await tx.taskSubmissionRequirement.create({
          data: {
            taskId: id,
            submissionType: data.submission.submissionType as any,
            instructions: data.submission.instructions || null,
            isRequired: data.submission.isRequired ?? true
          }
        })
      }
      
      return tx.task.findUnique({
        where: { id },
        include: { 
          contents: { orderBy: { orderIndex: 'asc' } },
          submissionRequirement: true
        }
      })
    })
    
    revalidatePath('/admin/learning-paths')
    return { success: true, data: task }
  } catch (error) {
    console.error('Error updating task with contents:', error)
    return { success: false, error: 'Failed to update task' }
  }
}

// Get task with contents
export async function getTaskById(id: string): Promise<ActionResponse<any>> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        contents: {
          orderBy: { orderIndex: 'asc' }
        },
        submissionRequirement: true,
        module: {
          include: {
            learningPath: {
              select: { id: true, title: true }
            }
          }
        }
      }
    })
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }
    
    return { success: true, data: task }
  } catch (error) {
    console.error('Error fetching task:', error)
    return { success: false, error: 'Failed to fetch task' }
  }
}

// Get module with tasks and contents
export async function getModuleById(id: string): Promise<ActionResponse<any>> {
  try {
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        learningPath: {
          select: { id: true, title: true }
        },
        tasks: {
          orderBy: { orderIndex: 'asc' },
          include: {
            contents: {
              orderBy: { orderIndex: 'asc' }
            },
            submissionRequirement: true
          }
        }
      }
    })
    
    if (!module) {
      return { success: false, error: 'Module not found' }
    }
    
    return { success: true, data: module }
  } catch (error) {
    console.error('Error fetching module:', error)
    return { success: false, error: 'Failed to fetch module' }
  }
}

// ==================== SUBMISSION ACTIONS ====================

// Submit task (intern)
export async function submitTask(data: {
  taskId: string
  content: string
  fileUrl?: string
  fileName?: string
}): Promise<ActionResponse<any>> {
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
    
    // Check if submission requirement exists
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
      include: { submissionRequirement: true }
    })
    
    if (!task) {
      return { success: false, error: 'Task not found' }
    }
    
    if (!task.submissionRequirement) {
      return { success: false, error: 'This task does not require submission' }
    }
    
    // Create or update submission
    const submission = await prisma.taskSubmission.upsert({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId: data.taskId
        }
      },
      update: {
        content: data.content,
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        status: 'PENDING',
        submittedAt: new Date()
      },
      create: {
        userId: user.id,
        taskId: data.taskId,
        content: data.content,
        fileUrl: data.fileUrl || null,
        fileName: data.fileName || null,
        status: 'PENDING'
      }
    })
    
    revalidatePath('/dashboard/learning')
    return { success: true, data: submission }
  } catch (error) {
    console.error('Error submitting task:', error)
    return { success: false, error: 'Failed to submit task' }
  }
}

// Review submission (admin only)
export async function reviewSubmission(data: {
  submissionId: string
  status: 'APPROVED' | 'REJECTED' | 'REVISION'
  feedback?: string
}): Promise<ActionResponse<any>> {
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
    
    const submission = await prisma.taskSubmission.update({
      where: { id: data.submissionId },
      data: {
        status: data.status,
        feedback: data.feedback || null,
        reviewedAt: new Date(),
        reviewedBy: user.id
      }
    })
    
    // If approved and submission was required, mark task as complete
    if (data.status === 'APPROVED') {
      const task = await prisma.task.findUnique({
        where: { id: submission.taskId },
        include: { submissionRequirement: true }
      })
      
      if (task?.submissionRequirement?.isRequired) {
        await prisma.taskProgress.upsert({
          where: {
            userId_taskId: {
              userId: submission.userId,
              taskId: submission.taskId
            }
          },
          update: {
            isCompleted: true,
            completedAt: new Date()
          },
          create: {
            userId: submission.userId,
            taskId: submission.taskId,
            isCompleted: true,
            completedAt: new Date()
          }
        })
        
        // Update progress percentage
        await updateProgressPercentage(submission.userId)
      }
    }
    
    revalidatePath('/admin/progress')
    return { success: true, data: submission }
  } catch (error) {
    console.error('Error reviewing submission:', error)
    return { success: false, error: 'Failed to review submission' }
  }
}

// Get all pending submissions (admin only)
export async function getPendingSubmissions(): Promise<ActionResponse<any[]>> {
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
    
    const submissions = await prisma.taskSubmission.findMany({
      where: { status: 'PENDING' },
      orderBy: { submittedAt: 'asc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        task: {
          select: { 
            id: true, 
            title: true,
            submissionRequirement: true,
            module: {
              select: {
                title: true,
                learningPath: {
                  select: { title: true }
                }
              }
            }
          }
        }
      }
    })
    
    return { success: true, data: submissions }
  } catch (error) {
    console.error('Error fetching pending submissions:', error)
    return { success: false, error: 'Failed to fetch submissions' }
  }
}

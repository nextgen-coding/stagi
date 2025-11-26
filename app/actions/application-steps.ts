'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

// Field types enum (matches Prisma schema)
type FieldType = 
  | 'TEXT'
  | 'TEXTAREA'
  | 'EMAIL'
  | 'PHONE'
  | 'URL'
  | 'SELECT'
  | 'MULTI_SELECT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'DATE'
  | 'IMAGE'
  | 'PDF'
  | 'NUMBER'
  | 'HEADING'
  | 'PARAGRAPH'

// ============== HELPERS ==============

async function requireAdmin() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  
  return user
}

// ============== APPLICATION STEPS ==============

export async function getApplicationSteps(internshipId: string) {
  try {
    const steps = await prisma.applicationStep.findMany({
      where: { internshipId },
      orderBy: { order: 'asc' },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })
    return { success: true, data: steps }
  } catch (error) {
    console.error('Error fetching application steps:', error)
    return { success: false, error: 'Failed to fetch application steps' }
  }
}

export async function getActiveApplicationSteps(internshipId: string) {
  try {
    const steps = await prisma.applicationStep.findMany({
      where: { internshipId, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        fields: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })
    return { success: true, data: steps }
  } catch (error) {
    console.error('Error fetching active application steps:', error)
    return { success: false, error: 'Failed to fetch application steps' }
  }
}

export async function createApplicationStep(data: {
  internshipId: string
  title: string
  description?: string
  isRequired?: boolean
}) {
  try {
    await requireAdmin()

    // Get the highest order value
    const lastStep = await prisma.applicationStep.findFirst({
      where: { internshipId: data.internshipId },
      orderBy: { order: 'desc' }
    })

    const step = await prisma.applicationStep.create({
      data: {
        ...data,
        order: (lastStep?.order ?? -1) + 1
      },
      include: {
        fields: true
      }
    })

    revalidatePath(`/admin/internships/${data.internshipId}/apply-settings`)
    return { success: true, data: step }
  } catch (error) {
    console.error('Error creating application step:', error)
    return { success: false, error: 'Failed to create application step' }
  }
}

export async function updateApplicationStep(id: string, data: {
  title?: string
  description?: string
  isRequired?: boolean
  isActive?: boolean
}) {
  try {
    await requireAdmin()

    const step = await prisma.applicationStep.update({
      where: { id },
      data,
      include: {
        fields: true
      }
    })

    revalidatePath(`/admin/internships/${step.internshipId}/apply-settings`)
    return { success: true, data: step }
  } catch (error) {
    console.error('Error updating application step:', error)
    return { success: false, error: 'Failed to update application step' }
  }
}

export async function deleteApplicationStep(id: string) {
  try {
    await requireAdmin()

    const step = await prisma.applicationStep.delete({
      where: { id }
    })

    revalidatePath(`/admin/internships/${step.internshipId}/apply-settings`)
    return { success: true, data: step }
  } catch (error) {
    console.error('Error deleting application step:', error)
    return { success: false, error: 'Failed to delete application step' }
  }
}

export async function reorderApplicationSteps(internshipId: string, stepIds: string[]) {
  try {
    await requireAdmin()

    // Update each step's order
    await Promise.all(
      stepIds.map((id, index) =>
        prisma.applicationStep.update({
          where: { id },
          data: { order: index }
        })
      )
    )

    revalidatePath(`/admin/internships/${internshipId}/apply-settings`)
    return { success: true }
  } catch (error) {
    console.error('Error reordering steps:', error)
    return { success: false, error: 'Failed to reorder steps' }
  }
}

// ============== APPLICATION FIELDS ==============

export async function createApplicationField(data: {
  stepId: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  options?: string // JSON string
  validation?: string // JSON string
  defaultValue?: string
  isRequired?: boolean
  width?: string
}) {
  try {
    await requireAdmin()

    // Get the highest order value
    const lastField = await prisma.applicationField.findFirst({
      where: { stepId: data.stepId },
      orderBy: { order: 'desc' }
    })

    const field = await prisma.applicationField.create({
      data: {
        ...data,
        order: (lastField?.order ?? -1) + 1
      }
    })

    // Get the step to find internshipId for revalidation
    const step = await prisma.applicationStep.findUnique({
      where: { id: data.stepId }
    })

    if (step) {
      revalidatePath(`/admin/internships/${step.internshipId}/apply-settings`)
    }

    return { success: true, data: field }
  } catch (error) {
    console.error('Error creating application field:', error)
    return { success: false, error: 'Failed to create application field' }
  }
}

export async function updateApplicationField(id: string, data: {
  type?: FieldType
  label?: string
  placeholder?: string
  helpText?: string
  options?: string
  validation?: string
  defaultValue?: string
  isRequired?: boolean
  isActive?: boolean
  width?: string
}) {
  try {
    await requireAdmin()

    const field = await prisma.applicationField.update({
      where: { id },
      data,
      include: {
        step: true
      }
    })

    revalidatePath(`/admin/internships/${field.step.internshipId}/apply-settings`)
    return { success: true, data: field }
  } catch (error) {
    console.error('Error updating application field:', error)
    return { success: false, error: 'Failed to update application field' }
  }
}

export async function deleteApplicationField(id: string) {
  try {
    await requireAdmin()

    const field = await prisma.applicationField.delete({
      where: { id },
      include: {
        step: true
      }
    })

    revalidatePath(`/admin/internships/${field.step.internshipId}/apply-settings`)
    return { success: true, data: field }
  } catch (error) {
    console.error('Error deleting application field:', error)
    return { success: false, error: 'Failed to delete application field' }
  }
}

export async function reorderApplicationFields(stepId: string, fieldIds: string[]) {
  try {
    await requireAdmin()

    // Update each field's order
    await Promise.all(
      fieldIds.map((id, index) =>
        prisma.applicationField.update({
          where: { id },
          data: { order: index }
        })
      )
    )

    // Get the step to find internshipId for revalidation
    const step = await prisma.applicationStep.findUnique({
      where: { id: stepId }
    })

    if (step) {
      revalidatePath(`/admin/internships/${step.internshipId}/apply-settings`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error reordering fields:', error)
    return { success: false, error: 'Failed to reorder fields' }
  }
}

// ============== DUPLICATE STEP (with all fields) ==============

export async function duplicateApplicationStep(stepId: string) {
  try {
    await requireAdmin()

    const originalStep = await prisma.applicationStep.findUnique({
      where: { id: stepId },
      include: { fields: true }
    })

    if (!originalStep) {
      return { success: false, error: 'Step not found' }
    }

    // Get the highest order value
    const lastStep = await prisma.applicationStep.findFirst({
      where: { internshipId: originalStep.internshipId },
      orderBy: { order: 'desc' }
    })

    // Create new step
    const newStep = await prisma.applicationStep.create({
      data: {
        internshipId: originalStep.internshipId,
        title: `${originalStep.title} (Copy)`,
        description: originalStep.description,
        isRequired: originalStep.isRequired,
        order: (lastStep?.order ?? -1) + 1
      }
    })

    // Duplicate all fields
    if (originalStep.fields.length > 0) {
      await prisma.applicationField.createMany({
        data: originalStep.fields.map(field => ({
          stepId: newStep.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          helpText: field.helpText,
          options: field.options,
          validation: field.validation,
          defaultValue: field.defaultValue,
          isRequired: field.isRequired,
          width: field.width,
          order: field.order
        }))
      })
    }

    // Fetch the complete step with fields
    const completeStep = await prisma.applicationStep.findUnique({
      where: { id: newStep.id },
      include: { fields: true }
    })

    revalidatePath(`/admin/internships/${originalStep.internshipId}/apply-settings`)
    return { success: true, data: completeStep }
  } catch (error) {
    console.error('Error duplicating step:', error)
    return { success: false, error: 'Failed to duplicate step' }
  }
}

// ============== CREATE DEFAULT STEPS ==============

export async function createDefaultApplicationSteps(internshipId: string) {
  try {
    await requireAdmin()

    // Check if steps already exist
    const existingSteps = await prisma.applicationStep.count({
      where: { internshipId }
    })

    if (existingSteps > 0) {
      return { success: false, error: 'Application steps already exist for this internship' }
    }

    // Create default steps with fields
    const steps = [
      {
        title: 'Personal Information',
        description: 'Tell us about yourself',
        order: 0,
        fields: [
          { type: 'TEXT' as FieldType, label: 'Full Name', placeholder: 'Enter your full name', isRequired: true, width: 'half', order: 0 },
          { type: 'EMAIL' as FieldType, label: 'Email Address', placeholder: 'your@email.com', isRequired: true, width: 'half', order: 1 },
          { type: 'PHONE' as FieldType, label: 'Phone Number', placeholder: '+1 (555) 123-4567', isRequired: true, width: 'half', order: 2 },
          { type: 'URL' as FieldType, label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/yourprofile', isRequired: false, width: 'half', order: 3 },
        ]
      },
      {
        title: 'Education & Experience',
        description: 'Share your background',
        order: 1,
        fields: [
          { type: 'TEXTAREA' as FieldType, label: 'Education', placeholder: 'Describe your educational background...', helpText: 'Include your degree, institution, and graduation year', isRequired: true, width: 'full', order: 0 },
          { type: 'TEXTAREA' as FieldType, label: 'Relevant Experience', placeholder: 'Describe any relevant experience...', helpText: 'Include internships, projects, or work experience', isRequired: true, width: 'full', order: 1 },
        ]
      },
      {
        title: 'Portfolio & Links',
        description: 'Show us your work',
        order: 2,
        fields: [
          { type: 'URL' as FieldType, label: 'Portfolio/Website', placeholder: 'https://yourportfolio.com', isRequired: false, width: 'half', order: 0 },
          { type: 'URL' as FieldType, label: 'GitHub Profile', placeholder: 'https://github.com/username', isRequired: false, width: 'half', order: 1 },
          { type: 'FILE' as FieldType, label: 'Resume/CV', helpText: 'Upload your resume (PDF, max 5MB)', isRequired: true, width: 'full', order: 2 },
        ]
      },
      {
        title: 'Motivation',
        description: 'Tell us why you\'re interested',
        order: 3,
        fields: [
          { type: 'TEXTAREA' as FieldType, label: 'Why are you interested in this internship?', placeholder: 'Share what excites you about this opportunity...', isRequired: true, width: 'full', order: 0 },
          { type: 'TEXTAREA' as FieldType, label: 'What do you hope to learn?', placeholder: 'Describe what skills and knowledge you want to gain...', isRequired: true, width: 'full', order: 1 },
          { type: 'SELECT' as FieldType, label: 'Availability', options: JSON.stringify(['Immediately', 'Within 2 weeks', 'Within 1 month', 'Flexible']), isRequired: true, width: 'half', order: 2 },
        ]
      }
    ]

    // Create steps with their fields
    for (const stepData of steps) {
      const { fields, ...stepInfo } = stepData
      const step = await prisma.applicationStep.create({
        data: {
          internshipId,
          ...stepInfo
        }
      })

      if (fields.length > 0) {
        await prisma.applicationField.createMany({
          data: fields.map(field => ({
            stepId: step.id,
            ...field
          }))
        })
      }
    }

    revalidatePath(`/admin/internships/${internshipId}/apply-settings`)
    return { success: true }
  } catch (error) {
    console.error('Error creating default steps:', error)
    return { success: false, error: 'Failed to create default steps' }
  }
}

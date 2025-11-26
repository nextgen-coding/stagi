import { ApplicationStatus, UserRole } from '@prisma/client'

// Server action response wrapper
export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Application with related data
export type ApplicationWithRelations = {
  id: string
  userId: string
  internshipId: string
  status: ApplicationStatus
  resumeUrl: string
  coverLetter: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  appliedAt: Date
  updatedAt: Date
  internship: {
    id: string
    title: string
    department: string
    location: string | null
    duration: string | null
  }
}

// Internship with application count
export type InternshipWithCount = {
  id: string
  title: string
  department: string
  description: string
  location: string | null
  duration: string | null
  createdAt: Date
  _count: {
    applications: number
  }
}

// Full application for admin view
export type FullApplication = {
  id: string
  userId: string
  internshipId: string
  status: ApplicationStatus
  resumeUrl: string
  coverLetter: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  appliedAt: Date
  updatedAt: Date
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
  internship: {
    id: string
    title: string
    department: string
  }
}

// User data
export type UserData = {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// Form data types
export type ApplicationFormData = {
  internshipId: string
  resumeUrl: string
  coverLetter?: string
  linkedinUrl?: string
  githubUrl?: string
}

export type InternshipFormData = {
  title: string
  department: string
  description: string
  requirements?: string
  location?: string
  duration?: string
}

# InternFlow - Internship Management Platform

## 📋 Product Specification Document

### Version 1.0 | Last Updated: November 23, 2025

---

## 1. Executive Summary

**InternFlow** is a full-stack web application that streamlines the internship hiring process for startups. The platform enables administrators to post internship opportunities and manage applications while providing candidates with an intuitive interface to discover and apply for positions.

### Key Features
- 🔐 Multi-role authentication (Admin/Candidate)
- 📝 Dynamic job posting management
- 📄 Application submission with resume upload
- 📊 Real-time application status tracking
- 🎯 Admin dashboard with applicant management
- 🔔 Optimistic UI updates for instant feedback

---

## 2. Technical Architecture

### 2.1 Core Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | Server-side rendering, API routes, file-based routing |
| **Language** | TypeScript | Type safety across frontend and backend |
| **Styling** | Tailwind CSS + Shadcn/UI | Utility-first CSS with accessible component library |
| **Database** | Neon (Serverless PostgreSQL) | Scalable serverless database with branching |
| **ORM** | Prisma | Type-safe database client with migrations |
| **Authentication** | Clerk | Multi-session auth, role-based access control |
| **File Storage** | UploadThing | Serverless file uploads for resumes |
| **State Management** | Zustand | Client-side UI state (forms, modals) |
| **Server State** | TanStack React Query | Async state, caching, optimistic updates |

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Zustand    │  │ React Query  │      │
│  │  App Router  │  │  (UI State)  │  │ (Server Data)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP
┌─────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Routes  │  │    Clerk     │  │ UploadThing  │      │
│  │ (Server      │  │  Auth Logic  │  │  File Upload │      │
│  │  Actions)    │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   Prisma     │  │     Neon     │                         │
│  │     ORM      │←→│  PostgreSQL  │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Prisma)

### 3.1 Prisma Schema Definition

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(uuid())
  clerkId      String        @unique @map("clerk_id")
  email        String        @unique
  firstName    String?       @map("first_name")
  lastName     String?       @map("last_name")
  role         UserRole      @default(CANDIDATE)
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  
  applications Application[]
  
  @@index([clerkId])
  @@index([email])
  @@map("users")
}

model Internship {
  id           String        @id @default(uuid())
  title        String
  department   String
  description  String        @db.Text
  requirements String?       @db.Text
  location     String?
  duration     String?       // e.g., "3 months", "Summer 2025"
  isOpen       Boolean       @default(true) @map("is_open")
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  
  applications Application[]
  
  @@index([isOpen])
  @@map("internships")
}

model Application {
  id            String            @id @default(uuid())
  userId        String            @map("user_id")
  internshipId  String            @map("internship_id")
  status        ApplicationStatus @default(PENDING)
  resumeUrl     String            @map("resume_url")
  coverLetter   String?           @db.Text @map("cover_letter")
  linkedinUrl   String?           @map("linkedin_url")
  githubUrl     String?           @map("github_url")
  appliedAt     DateTime          @default(now()) @map("applied_at")
  updatedAt     DateTime          @updatedAt @map("updated_at")
  
  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  internship    Internship        @relation(fields: [internshipId], references: [id], onDelete: Cascade)
  
  @@unique([userId, internshipId]) // Prevent duplicate applications
  @@index([userId])
  @@index([internshipId])
  @@index([status])
  @@map("applications")
}

enum UserRole {
  ADMIN
  CANDIDATE
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  ACCEPTED
  REJECTED
}
```

### 3.2 Database Relationships

```
User (1) ──────< (N) Application (N) >────── (1) Internship
         userId                  internshipId
```

### 3.3 Key Constraints
- **Unique Constraint**: One user cannot apply to the same internship twice
- **Cascade Delete**: Deleting a user/internship removes related applications
- **Indexes**: Optimized queries on frequently searched fields

---

## 4. User Flows & Page Structure

### 4.1 Public Routes (Unauthenticated)

#### **Landing Page** (`/`)
```
┌────────────────────────────────────────────┐
│ HERO SECTION                               │
│ "Join Our Startup Revolution"              │
│ [Get Started] [View Openings]              │
├────────────────────────────────────────────┤
│ OPEN POSITIONS GRID                        │
│ ┌──────┐ ┌──────┐ ┌──────┐                │
│ │ Card │ │ Card │ │ Card │                │
│ └──────┘ └──────┘ └──────┘                │
└────────────────────────────────────────────┘
```

**Features**:
- Fetches open internships via React Query
- Real-time data with `staleTime: 5 minutes`
- Skeleton loading states
- Filter by department (optional)

**Data Fetching**:
```typescript
const { data: internships, isLoading } = useQuery({
  queryKey: ['internships', 'open'],
  queryFn: getOpenInternships,
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

---

#### **Internship Detail Page** (`/internship/[id]`)
```
┌────────────────────────────────────────────┐
│ < Back to Positions                        │
├────────────────────────────────────────────┤
│ FRONTEND DEVELOPER INTERN                  │
│ Engineering • Remote • 3 months            │
├────────────────────────────────────────────┤
│ Description                                │
│ [Full rich text content]                   │
├────────────────────────────────────────────┤
│ Requirements                               │
│ • React.js experience                      │
│ • TypeScript knowledge                     │
├────────────────────────────────────────────┤
│ [Apply Now] ← Triggers Clerk Auth         │
└────────────────────────────────────────────┘
```

**Features**:
- Server-side data fetching for SEO
- Protected "Apply" button (redirects to Clerk if not authenticated)
- Checks if user already applied (disable button)

---

### 4.2 Candidate Routes (Authenticated as `CANDIDATE`)

#### **Application Wizard** (`/apply/[id]`)

**Multi-Step Form with Zustand State**:

```typescript
// Store structure
interface ApplicationStore {
  step: 1 | 2 | 3
  formData: {
    resumeUrl: string
    coverLetter: string
    linkedinUrl: string
    githubUrl: string
  }
  setStep: (step: number) => void
  updateFormData: (data: Partial<FormData>) => void
  resetForm: () => void
}
```

**Step 1**: Authentication Check (Clerk)
```
┌────────────────────────────────────────────┐
│ Step 1 of 3: Account Setup                 │
├────────────────────────────────────────────┤
│ ✓ Authenticated as john@email.com         │
│ [Continue] →                               │
└────────────────────────────────────────────┘
```

**Step 2**: Profile Information
```
┌────────────────────────────────────────────┐
│ Step 2 of 3: Your Information              │
├────────────────────────────────────────────┤
│ LinkedIn URL (Optional)                    │
│ [https://linkedin.com/in/...]              │
│                                            │
│ GitHub URL (Optional)                      │
│ [https://github.com/...]                   │
│                                            │
│ [← Back] [Continue →]                      │
└────────────────────────────────────────────┘
```

**Step 3**: Documents & Submit
```
┌────────────────────────────────────────────┐
│ Step 3 of 3: Final Details                 │
├────────────────────────────────────────────┤
│ Upload Resume (Required) *                 │
│ [📎 Choose File] resume.pdf                │
│                                            │
│ Cover Letter (Optional)                    │
│ [Text area for cover letter]              │
│                                            │
│ [← Back] [Submit Application]             │
└────────────────────────────────────────────┘
```

**Submission Logic**:
```typescript
const mutation = useMutation({
  mutationFn: submitApplication,
  onSuccess: () => {
    queryClient.invalidateQueries(['user-applications'])
    router.push('/dashboard')
  }
})
```

---

#### **Candidate Dashboard** (`/dashboard`)
```
┌────────────────────────────────────────────┐
│ My Applications                            │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐  │
│ │ Frontend Intern                      │  │
│ │ Applied: Nov 20, 2025                │  │
│ │ Status: [🟡 PENDING]                 │  │
│ │ [View Details]                       │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ Backend Intern                       │  │
│ │ Applied: Nov 15, 2025                │  │
│ │ Status: [🟢 ACCEPTED]                │  │
│ │ [View Details]                       │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

**Features**:
- Real-time status updates
- Status color coding:
  - 🟡 Yellow: PENDING
  - 🔵 Blue: REVIEWING
  - 🟢 Green: ACCEPTED
  - 🔴 Red: REJECTED
- Empty state: "No applications yet. [Browse Positions]"

**Data Fetching**:
```typescript
const { data: applications } = useQuery({
  queryKey: ['user-applications'],
  queryFn: getUserApplications,
  refetchInterval: 30000, // Refresh every 30s
})
```

---

### 4.3 Admin Routes (Authenticated as `ADMIN`)

#### **Admin Dashboard** (`/admin`)

**Overview Section**:
```
┌────────────────────────────────────────────┐
│ Dashboard Overview                         │
├──────────────┬──────────────┬──────────────┤
│ Total Apps   │ Open Roles   │ Pending      │
│     47       │      5       │     12       │
└──────────────┴──────────────┴──────────────┘
```

**Applications Table**:
```
┌──────────────────────────────────────────────────────────────────┐
│ All Applications                                    [+ New Role] │
├─────────┬─────────────┬──────────────┬──────────┬──────────────┤
│ Name    │ Position    │ Applied Date │ Status   │ Actions      │
├─────────┼─────────────┼──────────────┼──────────┼──────────────┤
│ John D. │ Frontend    │ Nov 20, 2025 │ PENDING  │ [View] [⋮]  │
│ Sarah M.│ Backend     │ Nov 19, 2025 │ REVIEWING│ [View] [⋮]  │
│ Mike C. │ Design      │ Nov 18, 2025 │ ACCEPTED │ [View] [⋮]  │
└─────────┴─────────────┴──────────────┴──────────┴──────────────┘
```

**Features**:
- Server-side pagination (10 items per page)
- Sortable columns (by date, status)
- Filter by status dropdown
- Search by candidate name

**Actions Menu** (⋮):
- View Full Application (Opens modal)
- Update Status (Dropdown)
- Download Resume
- Delete Application

**Application Detail Modal**:
```
┌────────────────────────────────────────────┐
│ Application Details               [✕]      │
├────────────────────────────────────────────┤
│ Candidate: John Doe                        │
│ Email: john@email.com                      │
│ Position: Frontend Developer Intern        │
│ Applied: November 20, 2025                 │
├────────────────────────────────────────────┤
│ Resume: [📄 Download PDF]                  │
│ LinkedIn: [🔗 View Profile]                │
│ GitHub: [🔗 View Profile]                  │
├────────────────────────────────────────────┤
│ Cover Letter:                              │
│ [Full text displayed here...]              │
├────────────────────────────────────────────┤
│ Update Status:                             │
│ [Dropdown: PENDING ▼]                      │
│                                            │
│ [Cancel] [Update Status]                   │
└────────────────────────────────────────────┘
```

**Optimistic Update Logic**:
```typescript
const updateStatusMutation = useMutation({
  mutationFn: updateApplicationStatus,
  onMutate: async ({ id, status }) => {
    // Cancel queries
    await queryClient.cancelQueries(['admin-applications'])
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['admin-applications'])
    
    // Optimistically update
    queryClient.setQueryData(['admin-applications'], (old: any) => {
      return old.map((app: Application) =>
        app.id === id ? { ...app, status } : app
      )
    })
    
    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['admin-applications'], context.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries(['admin-applications'])
  }
})
```

---

## 5. API Architecture (Next.js Server Actions)

### 5.1 Public APIs

#### **GET Open Internships**
```typescript
// app/actions/internships.ts
'use server'

export async function getOpenInternships() {
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
    }
  })
  
  return internships
}
```

#### **GET Internship Detail**
```typescript
'use server'

export async function getInternshipById(id: string) {
  const internship = await prisma.internship.findUnique({
    where: { id },
    include: {
      _count: {
        select: { applications: true }
      }
    }
  })
  
  if (!internship) {
    throw new Error('Internship not found')
  }
  
  return internship
}
```

---

### 5.2 Candidate APIs

#### **POST Submit Application**
```typescript
'use server'

import { auth } from '@clerk/nextjs'

export async function submitApplication(data: {
  internshipId: string
  resumeUrl: string
  coverLetter?: string
  linkedinUrl?: string
  githubUrl?: string
}) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  // Check for duplicate application
  const existing = await prisma.application.findUnique({
    where: {
      userId_internshipId: {
        userId: user.id,
        internshipId: data.internshipId
      }
    }
  })
  
  if (existing) {
    throw new Error('You have already applied to this position')
  }
  
  // Create application
  const application = await prisma.application.create({
    data: {
      userId: user.id,
      internshipId: data.internshipId,
      resumeUrl: data.resumeUrl,
      coverLetter: data.coverLetter,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
    },
    include: {
      internship: true
    }
  })
  
  return application
}
```

#### **GET User Applications**
```typescript
'use server'

export async function getUserApplications() {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: {
      internship: {
        select: {
          id: true,
          title: true,
          department: true,
        }
      }
    },
    orderBy: { appliedAt: 'desc' }
  })
  
  return applications
}
```

---

### 5.3 Admin APIs

#### **GET All Applications**
```typescript
'use server'

export async function getAdminApplications(params?: {
  status?: ApplicationStatus
  page?: number
  limit?: number
}) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  
  const page = params?.page || 1
  const limit = params?.limit || 10
  const skip = (page - 1) * limit
  
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: params?.status ? { status: params.status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        internship: {
          select: {
            id: true,
            title: true,
            department: true,
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.application.count({
      where: params?.status ? { status: params.status } : undefined,
    })
  ])
  
  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}
```

#### **PATCH Update Application Status**
```typescript
'use server'

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  
  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: {
      user: true,
      internship: true,
    }
  })
  
  // TODO: Send email notification to candidate
  
  return application
}
```

#### **GET Dashboard Stats**
```typescript
'use server'

export async function getAdminDashboardStats() {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  
  const [totalApplications, openRoles, pendingCount] = await Promise.all([
    prisma.application.count(),
    prisma.internship.count({ where: { isOpen: true } }),
    prisma.application.count({ where: { status: 'PENDING' } }),
  ])
  
  return {
    totalApplications,
    openRoles,
    pendingCount,
  }
}
```

---

## 6. Authentication & Authorization

### 6.1 Clerk Configuration

**Middleware Protection** (`middleware.ts`):
```typescript
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/internship/:id", "/api/webhooks/clerk"],
  ignoredRoutes: ["/api/uploadthing"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
```

**Role-Based Route Protection**:
```typescript
// app/admin/layout.tsx
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  
  return <>{children}</>
}
```

### 6.2 Clerk Webhook (User Sync)

**Webhook Handler** (`app/api/webhooks/clerk/route.ts`):
```typescript
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET')
  }
  
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")
  
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }
  
  const payload = await req.json()
  const body = JSON.stringify(payload)
  
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent
  
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }
  
  // Handle events
  if (evt.type === 'user.created') {
    await prisma.user.create({
      data: {
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0].email_address,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        role: 'CANDIDATE', // Default role
      }
    })
  }
  
  if (evt.type === 'user.updated') {
    await prisma.user.update({
      where: { clerkId: evt.data.id },
      data: {
        email: evt.data.email_addresses[0].email_address,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
      }
    })
  }
  
  if (evt.type === 'user.deleted') {
    await prisma.user.delete({
      where: { clerkId: evt.data.id! }
    })
  }
  
  return new Response('Success', { status: 200 })
}
```

---

## 7. State Management

### 7.1 Zustand Store (Client UI State)

**Application Form Store** (`stores/applicationStore.ts`):
```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ApplicationFormData {
  resumeUrl: string
  coverLetter: string
  linkedinUrl: string
  githubUrl: string
}

interface ApplicationStore {
  currentStep: 1 | 2 | 3
  formData: ApplicationFormData
  internshipId: string | null
  
  // Actions
  setStep: (step: 1 | 2 | 3) => void
  nextStep: () => void
  previousStep: () => void
  updateFormData: (data: Partial<ApplicationFormData>) => void
  setInternshipId: (id: string) => void
  resetForm: () => void
}

export const useApplicationStore = create<ApplicationStore>()(
  devtools(
    persist(
      (set) => ({
        currentStep: 1,
        formData: {
          resumeUrl: '',
          coverLetter: '',
          linkedinUrl: '',
          githubUrl: '',
        },
        internshipId: null,
        
        setStep: (step) => set({ currentStep: step }),
        
        nextStep: () => set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3
        })),
        
        previousStep: () => set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3
        })),
        
        updateFormData: (data) => set((state) => ({
          formData: { ...state.formData, ...data }
        })),
        
        setInternshipId: (id) => set({ internshipId: id }),
        
        resetForm: () => set({
          currentStep: 1,
          formData: {
            resumeUrl: '',
            coverLetter: '',
            linkedinUrl: '',
            githubUrl: '',
          },
          internshipId: null,
        }),
      }),
      {
        name: 'application-store',
        partialize: (state) => ({
          formData: state.formData,
          internshipId: state.internshipId,
        }),
      }
    ),
    { name: 'ApplicationStore' }
  )
)
```

---

### 7.2 React Query Setup

**Query Client Configuration** (`lib/react-query.tsx`):
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            onError: (error) => {
              console.error('Mutation error:', error)
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**Custom Hooks** (`hooks/useInternships.ts`):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOpenInternships,
  getInternshipById,
  getUserApplications,
  submitApplication,
  getAdminApplications,
  updateApplicationStatus,
  getAdminDashboardStats,
} from '@/app/actions'

// Public queries
export function useOpenInternships() {
  return useQuery({
    queryKey: ['internships', 'open'],
    queryFn: getOpenInternships,
  })
}

export function useInternshipDetail(id: string) {
  return useQuery({
    queryKey: ['internship', id],
    queryFn: () => getInternshipById(id),
    enabled: !!id,
  })
}

// Candidate queries
export function useUserApplications() {
  return useQuery({
    queryKey: ['user-applications'],
    queryFn: getUserApplications,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-applications'] })
      queryClient.invalidateQueries({ queryKey: ['internships'] })
    },
  })
}

// Admin queries
export function useAdminApplications(params?: {
  status?: string
  page?: number
}) {
  return useQuery({
    queryKey: ['admin-applications', params],
    queryFn: () => getAdminApplications(params),
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateApplicationStatus(id, status as any),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-applications'] })
      
      const previousData = queryClient.getQueryData(['admin-applications'])
      
      queryClient.setQueryData(['admin-applications'], (old: any) => {
        if (!old?.applications) return old
        
        return {
          ...old,
          applications: old.applications.map((app: any) =>
            app.id === id ? { ...app, status } : app
          ),
        }
      })
      
      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['admin-applications'], context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminDashboardStats,
    refetchInterval: 60000, // Refresh every minute
  })
}
```

---

## 8. File Upload (UploadThing)

### 8.1 Configuration

**Core Setup** (`app/api/uploadthing/core.ts`):
```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@clerk/nextjs"

const f = createUploadthing()

export const ourFileRouter = {
  resumeUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const { userId } = auth()
      
      if (!userId) throw new Error("Unauthorized")
      
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resume uploaded by:", metadata.userId)
      console.log("File URL:", file.url)
      
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

**Route Handler** (`app/api/uploadthing/route.ts`):
```typescript
import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
```

### 8.2 Client Component

**Resume Upload Component** (`components/ResumeUpload.tsx`):
```typescript
'use client'

import { UploadButton } from "@/lib/uploadthing"
import { useApplicationStore } from "@/stores/applicationStore"

export function ResumeUpload() {
  const updateFormData = useApplicationStore((state) => state.updateFormData)
  
  return (
    <UploadButton
      endpoint="resumeUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          updateFormData({ resumeUrl: res[0].url })
          alert("Resume uploaded successfully!")
        }
      }}
      onUploadError={(error: Error) => {
        alert(`Upload error: ${error.message}`)
      }}
    />
  )
}
```

---

## 9. Environment Variables

### 9.1 Required Configuration

**`.env.local`**:
```bash
# Database
DATABASE_URL="postgresql://user:password@hostname/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# UploadThing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="app_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Install dependencies (Prisma, Clerk, React Query, Zustand, Shadcn/UI)
- [ ] Set up Neon database connection
- [ ] Create Prisma schema and run migrations
- [ ] Configure Clerk authentication
- [ ] Set up React Query provider
- [ ] Implement Clerk webhook for user sync

### Phase 2: Core Features (Week 2-3)
- [ ] Build landing page with internship grid
- [ ] Create internship detail page
- [ ] Implement application wizard (3 steps)
- [ ] Set up UploadThing for resume uploads
- [ ] Build candidate dashboard
- [ ] Create Zustand store for form state

### Phase 3: Admin Panel (Week 4)
- [ ] Build admin dashboard layout
- [ ] Implement applications table with sorting/filtering
- [ ] Create application detail modal
- [ ] Add status update functionality with optimistic updates
- [ ] Build dashboard stats cards
- [ ] Implement role-based route protection

### Phase 4: Polish & Deploy (Week 5)
- [ ] Add loading skeletons and error boundaries
- [ ] Implement form validations (Zod schemas)
- [ ] Add toast notifications
- [ ] Write unit tests for critical paths
- [ ] Performance optimization (code splitting, image optimization)
- [ ] Deploy to Vercel
- [ ] Set up production database on Neon

---

## 11. Folder Structure

```
stagi/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Candidate dashboard
│   │   └── apply/[id]/
│   │       └── page.tsx              # Application wizard
│   ├── (public)/
│   │   ├── page.tsx                  # Landing page
│   │   └── internship/[id]/
│   │       └── page.tsx              # Internship detail
│   ├── admin/
│   │   ├── layout.tsx                # Admin protection
│   │   ├── page.tsx                  # Admin dashboard
│   │   └── internships/
│   │       └── page.tsx              # Manage internships
│   ├── api/
│   │   ├── uploadthing/
│   │   │   ├── core.ts
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── clerk/route.ts
│   ├── actions/                      # Server Actions
│   │   ├── internships.ts
│   │   ├── applications.ts
│   │   └── admin.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                           # Shadcn/UI components
│   ├── application/
│   │   ├── ApplicationWizard.tsx
│   │   ├── Step1Auth.tsx
│   │   ├── Step2Profile.tsx
│   │   └── Step3Documents.tsx
│   ├── internships/
│   │   ├── InternshipCard.tsx
│   │   └── InternshipGrid.tsx
│   ├── admin/
│   │   ├── ApplicationsTable.tsx
│   │   ├── ApplicationModal.tsx
│   │   └── StatsCards.tsx
│   └── shared/
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/
│   ├── useInternships.ts
│   ├── useApplications.ts
│   └── useAdmin.ts
├── stores/
│   └── applicationStore.ts
├── lib/
│   ├── prisma.ts
│   ├── react-query.tsx
│   ├── uploadthing.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── middleware.ts
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 12. Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    
    "@prisma/client": "^5.15.0",
    "prisma": "^5.15.0",
    
    "@clerk/nextjs": "^5.1.0",
    
    "@tanstack/react-query": "^5.40.0",
    "@tanstack/react-query-devtools": "^5.40.0",
    
    "zustand": "^4.5.0",
    
    "uploadthing": "^6.12.0",
    "@uploadthing/react": "^6.6.0",
    
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 13. Testing Strategy

### Unit Tests
- Prisma queries (mocked with `jest-mock-extended`)
- Server actions validation logic
- Zustand store state transitions

### Integration Tests
- Application submission flow (Clerk auth → form → DB)
- Admin status update (optimistic + rollback)
- File upload success/failure

### E2E Tests (Playwright)
- User journey: Browse → Apply → Check status
- Admin journey: Login → Review apps → Update status

---

## 14. Performance Considerations

### Database Optimization
- **Indexes**: All foreign keys, `clerkId`, `email`, `status`, `isOpen`
- **Query Optimization**: Use `select` to limit returned fields
- **Pagination**: Implement cursor-based pagination for large datasets

### Caching Strategy
- **React Query**: 1-minute stale time for static data
- **Next.js**: Static generation for public pages, ISR for internship listings
- **CDN**: UploadThing provides automatic CDN for uploaded files

### Code Splitting
- Lazy load admin panel components
- Dynamic imports for modal dialogs
- Separate bundles for authenticated routes

---

## 15. Security Checklist

- [x] HTTPS only in production
- [x] CSRF protection via Next.js built-in
- [x] SQL injection prevention (Prisma parameterized queries)
- [x] File upload validation (PDF only, 4MB max)
- [x] Rate limiting on API routes (Clerk built-in)
- [x] Webhook signature verification (Clerk + UploadThing)
- [x] Role-based access control (middleware + server actions)
- [x] Environment variables never exposed to client
- [x] Sanitize user inputs (Zod validation)
- [x] Secure cookies (httpOnly, secure, sameSite)

---

## 16. Future Enhancements (Post-MVP)

### v2.0 Features
- Email notifications (Resend.com integration)
- Calendar integration for interview scheduling
- Advanced filtering (skills tags, location)
- Applicant ranking system
- Bulk actions for admins
- Export applications to CSV
- Dark mode support

### v3.0 Features
- Multi-tenant support (multiple companies)
- AI-powered resume parsing
- Video interview integration
- Analytics dashboard
- Mobile app (React Native)

---

## 17. Support & Maintenance

### Monitoring
- **Error Tracking**: Sentry integration
- **Analytics**: Vercel Analytics + Posthog
- **Uptime**: Uptime Robot for health checks

### Backup Strategy
- **Database**: Neon automatic backups (point-in-time recovery)
- **File Storage**: UploadThing redundancy
- **Code**: Git version control + GitHub

### Documentation
- API documentation (OpenAPI spec)
- Component Storybook
- Admin user guide
- Developer onboarding guide

---

## Appendix: Quick Start Commands

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Seed database (optional)
npx prisma db seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (DB GUI)
npx prisma studio
```

---

**Document Version**: 1.0  
**Last Updated**: November 23, 2025  
**Maintained By**: Development Team  
**Status**: ✅ Ready for Implementation

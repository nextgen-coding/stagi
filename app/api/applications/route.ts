import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user from Clerk to ensure we have their data
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      )
    }

    // Ensure user exists in our database (upsert)
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        role: 'CANDIDATE',
      },
    })

    const body = await request.json()
    const {
      internshipId,
      fullName,
      email,
      phone,
      education,
      experience,
      whyInterested,
      availability,
      resumeUrl,
      coverLetter,
      linkedinUrl,
      githubUrl,
    } = body

    // Validate required fields
    if (!internshipId || !fullName || !email || !phone || !education || !experience || !whyInterested || !availability) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if internship exists and is open
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    })

    if (!internship) {
      return NextResponse.json(
        { success: false, error: 'Internship not found' },
        { status: 404 }
      )
    }

    if (!internship.isOpen) {
      return NextResponse.json(
        { success: false, error: 'This internship is no longer accepting applications' },
        { status: 400 }
      )
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: dbUser.id,
        internshipId,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied to this internship' },
        { status: 400 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: dbUser.id,
        internshipId,
        fullName,
        email,
        phone,
        education,
        experience,
        whyInterested,
        availability,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

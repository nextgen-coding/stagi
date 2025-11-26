import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const internship = await prisma.internship.findUnique({
      where: {
        id: id,
      },
    })

    if (!internship) {
      return NextResponse.json(
        { success: false, error: 'Internship not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      internship,
    })
  } catch (error) {
    console.error('Error fetching internship:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch internship' },
      { status: 500 }
    )
  }
}

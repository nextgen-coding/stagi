import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')
    const department = searchParams.get('department')

    const where: any = {
      isOpen: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (department && department !== 'all') {
      where.department = department
    }

    const internships = await prisma.internship.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      internships,
    })
  } catch (error) {
    console.error('Error fetching internships:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch internships' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const steps = await prisma.applicationStep.findMany({
      where: { internshipId: id },
      orderBy: { order: 'asc' },
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      }
    })
    
    return NextResponse.json({ success: true, data: steps })
  } catch (error) {
    console.error('Error fetching application steps:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application steps' },
      { status: 500 }
    )
  }
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('📊 Verification Report\n')
  console.log('='.repeat(60))

  // Internships with departments
  const internships = await prisma.internship.findMany({
    include: {
      departmentRef: true,
      internshipSkills: {
        include: { skill: { include: { categoryRef: true } } }
      }
    },
    orderBy: { title: 'asc' }
  })

  console.log(`\n💼 INTERNSHIPS (${internships.length} total)\n`)
  
  for (const int of internships) {
    const requiredSkills = int.internshipSkills.filter(s => s.isRequired).map(s => s.skill.name)
    const niceToHaveSkills = int.internshipSkills.filter(s => !s.isRequired).map(s => s.skill.name)
    
    console.log(`📌 ${int.title}`)
    console.log(`   Department: ${int.departmentRef?.name || '❌ NONE'} ${int.departmentRef ? '(' + int.departmentRef.color + ')' : ''}`)
    console.log(`   Required Skills: ${requiredSkills.join(', ') || 'None'}`)
    if (niceToHaveSkills.length > 0) {
      console.log(`   Nice-to-have: ${niceToHaveSkills.join(', ')}`)
    }
    console.log('')
  }

  // Summary by department
  console.log('='.repeat(60))
  console.log('\n📁 INTERNSHIPS BY DEPARTMENT\n')
  
  const departments = await prisma.department.findMany({
    include: {
      _count: { select: { internships: true, skills: true } }
    },
    orderBy: { name: 'asc' }
  })

  for (const dept of departments) {
    console.log(`${dept.icon} ${dept.name} (${dept.color})`)
    console.log(`   Internships: ${dept._count.internships}`)
    console.log(`   Skills: ${dept._count.skills}`)
    console.log('')
  }

  // Skills by category
  console.log('='.repeat(60))
  console.log('\n🏷️  SKILLS BY CATEGORY\n')
  
  const categories = await prisma.skillCategory.findMany({
    include: {
      _count: { select: { skills: true } }
    },
    orderBy: { name: 'asc' }
  })

  for (const cat of categories) {
    console.log(`   ${cat.name} (${cat.color}): ${cat._count.skills} skills`)
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n✅ Verification complete!')
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

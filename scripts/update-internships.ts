import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateInternships() {
  console.log('🔄 Updating existing internships with departments and skills...\n')

  // Get all departments
  const departments = await prisma.department.findMany()
  const deptMap = Object.fromEntries(departments.map(d => [d.name, d]))
  
  console.log('📁 Available departments:')
  departments.forEach(d => console.log(`   - ${d.name} (${d.id})`))

  // Get all skills
  const skills = await prisma.skill.findMany({
    include: { categoryRef: true, department: true }
  })
  
  console.log(`\n⚡ Total skills available: ${skills.length}`)

  // Get all internships
  const internships = await prisma.internship.findMany()
  console.log(`\n💼 Found ${internships.length} internships to update\n`)

  // Define skill mappings for internship titles
  const internshipSkillMappings: Record<string, { department: string; skills: string[] }> = {
    // Engineering
    'Software Engineering Intern': {
      department: 'Engineering',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git']
    },
    'Frontend Developer Intern': {
      department: 'Engineering',
      skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML/CSS']
    },
    'Backend Developer Intern': {
      department: 'Engineering',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Express.js', 'REST APIs', 'Docker']
    },
    'Mobile Development Intern': {
      department: 'Engineering',
      skills: ['React Native', 'TypeScript', 'iOS Development', 'Android Development', 'Flutter', 'Expo']
    },
    'DevOps Engineering Intern': {
      department: 'Engineering',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux']
    },
    'Full Stack Developer Intern': {
      department: 'Engineering',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Next.js', 'Tailwind CSS']
    },
    'Web Development Intern': {
      department: 'Engineering',
      skills: ['JavaScript', 'React', 'HTML/CSS', 'Node.js', 'Tailwind CSS']
    },
    
    // Marketing
    'Digital Marketing Intern': {
      department: 'Marketing',
      skills: ['Google Ads', 'Facebook Ads', 'Google Analytics', 'SEO', 'Social Media Management']
    },
    'Content Marketing Intern': {
      department: 'Marketing',
      skills: ['Content Writing', 'Copywriting', 'SEO', 'Email Marketing', 'HubSpot']
    },
    'Social Media Intern': {
      department: 'Marketing',
      skills: ['Social Media Management', 'Content Writing', 'Hootsuite', 'Buffer', 'Canva']
    },
    'Marketing Intern': {
      department: 'Marketing',
      skills: ['Google Analytics', 'Google Ads', 'Social Media Management', 'Content Writing', 'SEO']
    },
    'SEO Intern': {
      department: 'Marketing',
      skills: ['SEO', 'Google Analytics', 'SEMrush', 'Ahrefs', 'Content Writing']
    },
    'Growth Marketing Intern': {
      department: 'Marketing',
      skills: ['Google Ads', 'Facebook Ads', 'Google Analytics', 'Mixpanel', 'SEO', 'A/B Testing']
    },
    
    // Creative
    'UI/UX Design Intern': {
      department: 'Creative',
      skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Adobe XD', 'Visual Design']
    },
    'Graphic Design Intern': {
      department: 'Creative',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Visual Design', 'Typography', 'Canva']
    },
    'Video Production Intern': {
      department: 'Creative',
      skills: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'Storyboarding', 'Motion Design']
    },
    'Motion Graphics Intern': {
      department: 'Creative',
      skills: ['Adobe After Effects', 'Motion Design', 'Cinema 4D', 'Adobe Premiere Pro', 'Blender']
    },
    'Design Intern': {
      department: 'Creative',
      skills: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'UI Design', 'Visual Design']
    },
    'Product Design Intern': {
      department: 'Creative',
      skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Framer']
    },
    'Creative Design Intern': {
      department: 'Creative',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Visual Design', 'Canva', 'Typography']
    },
    
    // Data
    'Data Science Intern': {
      department: 'Data',
      skills: ['Python', 'SQL', 'pandas', 'NumPy', 'scikit-learn', 'Jupyter', 'TensorFlow']
    },
    'Business Intelligence Intern': {
      department: 'Data',
      skills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Google Analytics']
    },
    'Data Analyst Intern': {
      department: 'Data',
      skills: ['SQL', 'Python', 'Excel', 'Tableau', 'pandas', 'Google Analytics']
    },
    'Machine Learning Intern': {
      department: 'Data',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'NumPy', 'pandas']
    },
    'Analytics Intern': {
      department: 'Data',
      skills: ['SQL', 'Excel', 'Google Analytics', 'Tableau', 'Python']
    },
    
    // Finance
    'Finance & Accounting Intern': {
      department: 'Finance',
      skills: ['Excel', 'Financial Modeling', 'Financial Analysis', 'Budgeting', 'QuickBooks']
    },
    'Finance Intern': {
      department: 'Finance',
      skills: ['Excel', 'Financial Analysis', 'Budgeting', 'Financial Modeling']
    },
    'Financial Analyst Intern': {
      department: 'Finance',
      skills: ['Excel', 'Financial Modeling', 'Financial Analysis', 'SQL', 'Power BI']
    },
    'Accounting Intern': {
      department: 'Finance',
      skills: ['Excel', 'QuickBooks', 'Financial Analysis', 'Budgeting']
    },
    
    // People / HR
    'HR & Recruiting Intern': {
      department: 'People',
      skills: ['Recruiting', 'Interviewing', 'Onboarding', 'BambooHR', 'Greenhouse']
    },
    'HR Intern': {
      department: 'People',
      skills: ['Recruiting', 'Onboarding', 'Employee Relations', 'BambooHR']
    },
    'Recruiting Intern': {
      department: 'People',
      skills: ['Recruiting', 'Interviewing', 'Greenhouse', 'Lever']
    },
    'People Operations Intern': {
      department: 'People',
      skills: ['Onboarding', 'Employee Relations', 'Workday', 'BambooHR']
    }
  }

  // Helper to find best matching department based on title keywords
  function inferDepartment(title: string): string {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('software') || titleLower.includes('frontend') || 
        titleLower.includes('backend') || titleLower.includes('mobile') ||
        titleLower.includes('devops') || titleLower.includes('developer') ||
        titleLower.includes('engineering') || titleLower.includes('web dev') ||
        titleLower.includes('full stack') || titleLower.includes('fullstack')) {
      return 'Engineering'
    }
    if (titleLower.includes('marketing') || titleLower.includes('social media') ||
        titleLower.includes('content') || titleLower.includes('seo') ||
        titleLower.includes('growth') || titleLower.includes('digital')) {
      return 'Marketing'
    }
    if (titleLower.includes('design') || titleLower.includes('ui') || 
        titleLower.includes('ux') || titleLower.includes('graphic') ||
        titleLower.includes('video') || titleLower.includes('motion') ||
        titleLower.includes('creative')) {
      return 'Creative'
    }
    if (titleLower.includes('data') || titleLower.includes('analytics') ||
        titleLower.includes('analyst') || titleLower.includes('machine learning') ||
        titleLower.includes('bi ') || titleLower.includes('business intelligence')) {
      return 'Data'
    }
    if (titleLower.includes('finance') || titleLower.includes('accounting') ||
        titleLower.includes('financial')) {
      return 'Finance'
    }
    if (titleLower.includes('hr') || titleLower.includes('recruiting') ||
        titleLower.includes('people') || titleLower.includes('human resources')) {
      return 'People'
    }
    
    return 'Engineering' // Default
  }

  // Helper to get skills for a department
  function getDefaultSkillsForDepartment(deptName: string): string[] {
    const mapping: Record<string, string[]> = {
      'Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
      'Marketing': ['Google Analytics', 'Google Ads', 'Social Media Management', 'Content Writing', 'SEO'],
      'Creative': ['Figma', 'Adobe Photoshop', 'UI Design', 'Visual Design', 'Typography'],
      'Data': ['SQL', 'Python', 'Excel', 'Tableau', 'pandas'],
      'Finance': ['Excel', 'Financial Analysis', 'Budgeting', 'Financial Modeling'],
      'People': ['Recruiting', 'Interviewing', 'Onboarding', 'Employee Relations']
    }
    return mapping[deptName] || ['Communication', 'Problem Solving']
  }

  let updated = 0
  let skillsLinked = 0

  for (const internship of internships) {
    console.log(`\n📝 Processing: "${internship.title}"`)
    
    // Find matching skill mapping or infer
    let mapping = internshipSkillMappings[internship.title]
    let departmentName: string
    let skillNames: string[]
    
    if (mapping) {
      departmentName = mapping.department
      skillNames = mapping.skills
      console.log(`   📋 Found exact mapping for "${internship.title}"`)
    } else {
      // Try partial matching
      const matchingKey = Object.keys(internshipSkillMappings).find(key => 
        internship.title.toLowerCase().includes(key.toLowerCase().replace(' intern', ''))
      )
      
      if (matchingKey) {
        mapping = internshipSkillMappings[matchingKey]
        departmentName = mapping.department
        skillNames = mapping.skills
        console.log(`   📋 Found partial mapping via "${matchingKey}"`)
      } else {
        departmentName = inferDepartment(internship.title)
        skillNames = getDefaultSkillsForDepartment(departmentName)
        console.log(`   🔍 Inferred department: ${departmentName}`)
      }
    }

    const dept = deptMap[departmentName]
    if (!dept) {
      console.log(`   ⚠️  Department "${departmentName}" not found, skipping`)
      continue
    }

    // Update internship with department
    await prisma.internship.update({
      where: { id: internship.id },
      data: {
        department: departmentName,
        departmentId: dept.id
      }
    })
    console.log(`   ✅ Updated department to: ${departmentName}`)
    updated++

    // Clear existing skill links
    await prisma.internshipSkill.deleteMany({
      where: { internshipId: internship.id }
    })

    // Link skills
    let linkedCount = 0
    for (const skillName of skillNames) {
      const skill = skills.find(s => s.name === skillName)
      if (skill) {
        try {
          await prisma.internshipSkill.create({
            data: {
              internshipId: internship.id,
              skillId: skill.id,
              isRequired: linkedCount < 3 // First 3 skills are required
            }
          })
          linkedCount++
          skillsLinked++
        } catch {
          // Skip if already exists
        }
      }
    }
    console.log(`   🔗 Linked ${linkedCount} skills`)
  }

  // Final stats
  console.log('\n' + '='.repeat(50))
  console.log('📊 Update Summary:')
  console.log(`   ✅ Internships updated: ${updated}`)
  console.log(`   🔗 Total skills linked: ${skillsLinked}`)
  
  // Show final state
  const finalInternships = await prisma.internship.findMany({
    include: {
      departmentRef: true,
      internshipSkills: {
        include: { skill: true }
      }
    }
  })

  console.log('\n📋 Final Internship State:')
  for (const int of finalInternships) {
    const skillList = int.internshipSkills.map(s => s.skill.name).join(', ')
    console.log(`\n   "${int.title}"`)
    console.log(`   Department: ${int.departmentRef?.name || 'None'}`)
    console.log(`   Skills (${int.internshipSkills.length}): ${skillList || 'None'}`)
  }

  console.log('\n✨ Update completed successfully!')
}

updateInternships()
  .catch((e) => {
    console.error('❌ Update failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

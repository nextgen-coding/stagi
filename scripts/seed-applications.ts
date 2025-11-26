import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate a random date within the last 30 days
function randomRecentDate(daysBack = 30): Date {
  const now = new Date()
  const pastDate = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000)
  return pastDate
}

// Demo applicants data
const demoApplicants = [
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    education: 'BS Computer Science, MIT (Expected 2025)',
    experience: '2 years as a freelance web developer, built 15+ client websites. Internship at a local tech startup working on React applications.',
    availability: 'Full-time, available to start immediately',
  },
  {
    firstName: 'Marcus',
    lastName: 'Williams',
    email: 'marcus.williams@example.com',
    education: 'BA Marketing, NYU (2024)',
    experience: 'Marketing coordinator at university, managed social media accounts with 50k+ followers. Led campus brand ambassador program.',
    availability: 'Part-time during semester, full-time during breaks',
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@example.com',
    education: 'BFA Graphic Design, RISD (Expected 2025)',
    experience: 'Freelance graphic designer for 3 years. Created brand identities for 20+ small businesses. Portfolio includes award-winning poster designs.',
    availability: 'Full-time, prefer remote work options',
  },
  {
    firstName: 'James',
    lastName: 'Kim',
    email: 'james.kim@example.com',
    education: 'MS Data Science, Stanford (Expected 2025)',
    experience: 'Research assistant in ML lab, published 2 papers on NLP. Previous internship at Google working on recommendation systems.',
    availability: 'Full-time summer internship preferred',
  },
  {
    firstName: 'Aisha',
    lastName: 'Patel',
    email: 'aisha.patel@example.com',
    education: 'BS Finance, Wharton (Expected 2025)',
    experience: 'Investment banking club president, managed $50k portfolio. Summer analyst at regional bank.',
    availability: 'Full-time, willing to relocate',
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@example.com',
    education: 'BS Computer Engineering, Georgia Tech (2024)',
    experience: '3 internships in software development. Full-stack experience with Node.js, React, and PostgreSQL. Open source contributor.',
    availability: 'Full-time, available in 2 weeks',
  },
  {
    firstName: 'Luna',
    lastName: 'Martinez',
    email: 'luna.martinez@example.com',
    education: 'MA Communications, USC (Expected 2025)',
    experience: 'Social media manager for nonprofit with 100k reach. Content creator with personal brand of 25k followers.',
    availability: 'Part-time initially, transitioning to full-time',
  },
  {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    education: 'BS Psychology, UCLA (2024)',
    experience: 'HR intern at Fortune 500 company. Led university career services peer counseling program.',
    availability: 'Full-time, prefer hybrid work model',
  },
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    education: 'MS Computer Science, CMU (Expected 2025)',
    experience: 'Software engineer intern at Microsoft. Research in distributed systems. Hackathon winner 3x.',
    availability: 'Full-time, can start next month',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    education: 'BBA Accounting, University of Texas (2024)',
    experience: 'Tax season intern at Big 4 firm. Treasurer of business fraternity managing $30k budget.',
    availability: 'Full-time, CPA track preferred',
  },
  {
    firstName: 'Sofia',
    lastName: 'Andersson',
    email: 'sofia.andersson@example.com',
    education: 'BA Digital Media, Parsons (Expected 2025)',
    experience: 'UI/UX design intern at design agency. Created app interfaces for 5 startups. Figma expert.',
    availability: 'Full-time or part-time, flexible',
  },
  {
    firstName: 'Ryan',
    lastName: 'O\'Connor',
    email: 'ryan.oconnor@example.com',
    education: 'BS Statistics, UC Berkeley (2024)',
    experience: 'Data analyst intern at e-commerce company. Built dashboards tracking $10M+ in revenue.',
    availability: 'Full-time, prefer data-focused roles',
  },
  {
    firstName: 'Nina',
    lastName: 'Volkov',
    email: 'nina.volkov@example.com',
    education: 'BS Information Systems, Cornell (Expected 2025)',
    experience: 'IT support lead at university. Developed internal tools used by 500+ staff. Python automation specialist.',
    availability: 'Full-time summer, part-time during school',
  },
  {
    firstName: 'Chris',
    lastName: 'Taylor',
    email: 'chris.taylor@example.com',
    education: 'MBA, Harvard Business School (Expected 2025)',
    experience: '5 years in management consulting. Led teams of 10+ on strategic projects. Strong analytical background.',
    availability: 'Full-time, seeking leadership track',
  },
  {
    firstName: 'Zara',
    lastName: 'Ahmed',
    email: 'zara.ahmed@example.com',
    education: 'BS Marketing & Analytics, Northwestern (2024)',
    experience: 'Digital marketing intern at agency. Managed campaigns with $500k+ ad spend. Google Ads certified.',
    availability: 'Full-time, excited about growth marketing',
  },
]

const statuses = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'] as const

async function main() {
  console.log('🌱 Starting applications seed...\n')

  // Get all internships
  const internships = await prisma.internship.findMany({
    select: { id: true, title: true, department: true }
  })

  if (internships.length === 0) {
    console.log('❌ No internships found. Please run the main seed first.')
    return
  }

  console.log(`📋 Found ${internships.length} internships\n`)

  // Create demo users and applications
  let usersCreated = 0
  let applicationsCreated = 0

  for (const applicant of demoApplicants) {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: applicant.email }
    })

    if (!user) {
      // Create user with a fake clerkId
      user = await prisma.user.create({
        data: {
          clerkId: `demo_${applicant.email.replace('@', '_').replace('.', '_')}`,
          email: applicant.email,
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          role: 'CANDIDATE',
        }
      })
      usersCreated++
      console.log(`✅ Created user: ${applicant.firstName} ${applicant.lastName}`)
    } else {
      console.log(`⏭️  User exists: ${applicant.firstName} ${applicant.lastName}`)
    }

    // Create 1-3 applications for each user
    const numApplications = Math.floor(Math.random() * 3) + 1
    const shuffledInternships = [...internships].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < Math.min(numApplications, shuffledInternships.length); i++) {
      const internship = shuffledInternships[i]
      
      // Check if application already exists
      const existingApp = await prisma.application.findFirst({
        where: {
          userId: user.id,
          internshipId: internship.id
        }
      })

      if (!existingApp) {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        
        await prisma.application.create({
          data: {
            userId: user.id,
            internshipId: internship.id,
            status: status,
            fullName: `${applicant.firstName} ${applicant.lastName}`,
            email: applicant.email,
            phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            education: applicant.education,
            experience: applicant.experience,
            whyInterested: `I am very excited about the ${internship.title} position at your company. The ${internship.department} department aligns perfectly with my career goals and I believe my skills would be a great match. I am eager to contribute and learn from your talented team.`,
            availability: applicant.availability,
            linkedinUrl: `https://linkedin.com/in/${applicant.firstName.toLowerCase()}-${applicant.lastName.toLowerCase()}`,
            githubUrl: internship.department === 'Engineering' || internship.department === 'Data' 
              ? `https://github.com/${applicant.firstName.toLowerCase()}${applicant.lastName.toLowerCase()}`
              : null,
            appliedAt: randomRecentDate(),
          }
        })
        applicationsCreated++
        console.log(`   📝 Applied to: ${internship.title} (${status})`)
      }
    }
  }

  console.log(`\n✨ Seed complete!`)
  console.log(`   👤 Users created: ${usersCreated}`)
  console.log(`   📝 Applications created: ${applicationsCreated}`)
}

main()
  .catch((e) => {
    console.error('Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

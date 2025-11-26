import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // =====================================================
  // DEPARTMENTS
  // =====================================================
  console.log('\n📁 Creating departments...')
  
  const departmentsData = [
    {
      name: 'Engineering',
      description: 'Software development, infrastructure, and technical innovation',
      color: '#3B82F6', // Blue
      icon: 'Code'
    },
    {
      name: 'Marketing',
      description: 'Brand awareness, digital marketing, and growth strategies',
      color: '#F97316', // Orange
      icon: 'Megaphone'
    },
    {
      name: 'Creative',
      description: 'Design, multimedia production, and creative content',
      color: '#EC4899', // Pink
      icon: 'Palette'
    },
    {
      name: 'Data',
      description: 'Data science, analytics, and business intelligence',
      color: '#8B5CF6', // Purple
      icon: 'Database'
    },
    {
      name: 'Finance',
      description: 'Financial planning, accounting, and budgeting',
      color: '#10B981', // Green
      icon: 'TrendingUp'
    },
    {
      name: 'People',
      description: 'Human resources, recruiting, and employee experience',
      color: '#EF4444', // Red
      icon: 'Users'
    }
  ]

  const departments: Record<string, any> = {}
  
  for (const dept of departmentsData) {
    const existing = await prisma.department.findUnique({ where: { name: dept.name } })
    if (existing) {
      departments[dept.name] = existing
      console.log(`   ⏭️  Skipped ${dept.name} (already exists)`)
    } else {
      departments[dept.name] = await prisma.department.create({ data: dept })
      console.log(`   ✅ Created ${dept.name}`)
    }
  }

  // =====================================================
  // SKILL CATEGORIES
  // =====================================================
  console.log('\n🏷️  Creating skill categories...')
  
  const categoriesData = [
    {
      name: 'Programming Language',
      description: 'Core programming and scripting languages',
      color: '#3B82F6' // Blue
    },
    {
      name: 'Framework',
      description: 'Development frameworks and libraries',
      color: '#8B5CF6' // Purple
    },
    {
      name: 'Database',
      description: 'Database systems and data storage',
      color: '#10B981' // Green
    },
    {
      name: 'Cloud & DevOps',
      description: 'Cloud platforms and DevOps tools',
      color: '#F97316' // Orange
    },
    {
      name: 'Design Tool',
      description: 'Design and prototyping software',
      color: '#EC4899' // Pink
    },
    {
      name: 'Marketing Tool',
      description: 'Marketing platforms and analytics',
      color: '#EAB308' // Yellow
    },
    {
      name: 'Video & Motion',
      description: 'Video editing and motion graphics',
      color: '#EF4444' // Red
    },
    {
      name: 'Soft Skill',
      description: 'Interpersonal and professional skills',
      color: '#14B8A6' // Teal
    },
    {
      name: 'Mobile',
      description: 'Mobile development platforms and tools',
      color: '#6366F1' // Indigo
    },
    {
      name: 'Analytics',
      description: 'Data analysis and visualization tools',
      color: '#64748B' // Slate
    }
  ]

  const categories: Record<string, any> = {}
  
  for (const cat of categoriesData) {
    const existing = await prisma.skillCategory.findUnique({ where: { name: cat.name } })
    if (existing) {
      categories[cat.name] = existing
      console.log(`   ⏭️  Skipped ${cat.name} (already exists)`)
    } else {
      categories[cat.name] = await prisma.skillCategory.create({ data: cat })
      console.log(`   ✅ Created ${cat.name}`)
    }
  }

  // =====================================================
  // SKILLS
  // =====================================================
  console.log('\n⚡ Creating skills...')

  const skillsData = [
    // === ENGINEERING - Programming Languages ===
    { name: 'JavaScript', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Modern JavaScript (ES6+)' },
    { name: 'TypeScript', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Typed superset of JavaScript' },
    { name: 'Python', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'General-purpose programming language' },
    { name: 'Java', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Enterprise-grade programming language' },
    { name: 'Go', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Fast, compiled language by Google' },
    { name: 'Rust', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Systems programming language' },
    { name: 'C++', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'High-performance programming' },
    { name: 'Swift', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Apple ecosystem development' },
    { name: 'Kotlin', departmentId: departments['Engineering'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Modern JVM language for Android' },
    
    // === ENGINEERING - Frameworks (Web) ===
    { name: 'React', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'UI library for building interfaces' },
    { name: 'Next.js', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'React framework for production' },
    { name: 'Vue.js', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Progressive JavaScript framework' },
    { name: 'Angular', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Enterprise web framework' },
    { name: 'Node.js', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'JavaScript runtime environment' },
    { name: 'Express.js', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Minimalist Node.js web framework' },
    { name: 'Django', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Python web framework' },
    { name: 'FastAPI', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Modern Python API framework' },
    { name: 'Spring Boot', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Java enterprise framework' },
    { name: 'Tailwind CSS', departmentId: departments['Engineering'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Utility-first CSS framework' },
    
    // === ENGINEERING - Mobile ===
    { name: 'React Native', departmentId: departments['Engineering'].id, categoryId: categories['Mobile'].id, category: 'Mobile', description: 'Cross-platform mobile development' },
    { name: 'Flutter', departmentId: departments['Engineering'].id, categoryId: categories['Mobile'].id, category: 'Mobile', description: 'Google UI toolkit for mobile' },
    { name: 'iOS Development', departmentId: departments['Engineering'].id, categoryId: categories['Mobile'].id, category: 'Mobile', description: 'Native iOS app development' },
    { name: 'Android Development', departmentId: departments['Engineering'].id, categoryId: categories['Mobile'].id, category: 'Mobile', description: 'Native Android app development' },
    { name: 'Expo', departmentId: departments['Engineering'].id, categoryId: categories['Mobile'].id, category: 'Mobile', description: 'React Native development platform' },
    
    // === ENGINEERING - Databases ===
    { name: 'PostgreSQL', departmentId: departments['Engineering'].id, categoryId: categories['Database'].id, category: 'Database', description: 'Advanced relational database' },
    { name: 'MySQL', departmentId: departments['Engineering'].id, categoryId: categories['Database'].id, category: 'Database', description: 'Popular relational database' },
    { name: 'MongoDB', departmentId: departments['Engineering'].id, categoryId: categories['Database'].id, category: 'Database', description: 'NoSQL document database' },
    { name: 'Redis', departmentId: departments['Engineering'].id, categoryId: categories['Database'].id, category: 'Database', description: 'In-memory data store' },
    { name: 'Prisma', departmentId: departments['Engineering'].id, categoryId: categories['Database'].id, category: 'Database', description: 'Next-gen Node.js ORM' },
    { name: 'GraphQL', departmentId: departments['Engineering'].id, categoryId: categories['Database'].id, category: 'Database', description: 'Query language for APIs' },
    
    // === ENGINEERING - Cloud & DevOps ===
    { name: 'AWS', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Amazon Web Services' },
    { name: 'Google Cloud', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Google Cloud Platform' },
    { name: 'Azure', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Microsoft cloud platform' },
    { name: 'Docker', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Container platform' },
    { name: 'Kubernetes', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Container orchestration' },
    { name: 'CI/CD', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Continuous integration/deployment' },
    { name: 'GitHub Actions', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'GitHub automation platform' },
    { name: 'Terraform', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Infrastructure as code' },
    { name: 'Vercel', departmentId: departments['Engineering'].id, categoryId: categories['Cloud & DevOps'].id, category: 'Cloud & DevOps', description: 'Frontend deployment platform' },
    
    // === MARKETING - Marketing Tools ===
    { name: 'Google Ads', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Google advertising platform' },
    { name: 'Facebook Ads', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Meta advertising platform' },
    { name: 'LinkedIn Ads', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'B2B advertising platform' },
    { name: 'TikTok Ads', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Short-form video advertising' },
    { name: 'HubSpot', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Marketing automation platform' },
    { name: 'Mailchimp', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Email marketing platform' },
    { name: 'Hootsuite', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Social media management' },
    { name: 'Buffer', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Social scheduling tool' },
    { name: 'Sprout Social', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'Social media analytics' },
    { name: 'SEMrush', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'SEO and marketing toolkit' },
    { name: 'Ahrefs', departmentId: departments['Marketing'].id, categoryId: categories['Marketing Tool'].id, category: 'Marketing Tool', description: 'SEO analysis tool' },
    
    // === MARKETING - Analytics ===
    { name: 'Google Analytics', departmentId: departments['Marketing'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Web analytics platform' },
    { name: 'Mixpanel', departmentId: departments['Marketing'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Product analytics platform' },
    { name: 'Amplitude', departmentId: departments['Marketing'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Digital analytics platform' },
    { name: 'Hotjar', departmentId: departments['Marketing'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'User behavior analytics' },
    
    // === MARKETING - Soft Skills ===
    { name: 'Content Writing', departmentId: departments['Marketing'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Creating engaging written content' },
    { name: 'Copywriting', departmentId: departments['Marketing'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Persuasive marketing copy' },
    { name: 'SEO', departmentId: departments['Marketing'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Search engine optimization' },
    { name: 'Social Media Management', departmentId: departments['Marketing'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Managing brand social presence' },
    { name: 'Email Marketing', departmentId: departments['Marketing'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Email campaign management' },
    { name: 'Brand Strategy', departmentId: departments['Marketing'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Developing brand identity' },
    
    // === CREATIVE - Design Tools ===
    { name: 'Figma', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Collaborative design tool' },
    { name: 'Adobe XD', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'UI/UX design tool' },
    { name: 'Sketch', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Mac design toolkit' },
    { name: 'Adobe Photoshop', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Image editing software' },
    { name: 'Adobe Illustrator', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Vector graphics editor' },
    { name: 'Adobe InDesign', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Desktop publishing software' },
    { name: 'Canva', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Online design platform' },
    { name: 'Framer', departmentId: departments['Creative'].id, categoryId: categories['Design Tool'].id, category: 'Design Tool', description: 'Interactive design tool' },
    
    // === CREATIVE - Video & Motion ===
    { name: 'Adobe Premiere Pro', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Professional video editing' },
    { name: 'Adobe After Effects', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Motion graphics & VFX' },
    { name: 'DaVinci Resolve', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Video editing & color grading' },
    { name: 'Final Cut Pro', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Mac video editing' },
    { name: 'Cinema 4D', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: '3D modeling & animation' },
    { name: 'Blender', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Open-source 3D creation' },
    { name: 'CapCut', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Social video editing' },
    { name: 'Lottie', departmentId: departments['Creative'].id, categoryId: categories['Video & Motion'].id, category: 'Video & Motion', description: 'Web animation library' },
    
    // === CREATIVE - Soft Skills ===
    { name: 'UI Design', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'User interface design' },
    { name: 'UX Design', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'User experience design' },
    { name: 'Visual Design', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Creating visual aesthetics' },
    { name: 'Typography', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Font selection & arrangement' },
    { name: 'Color Theory', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Understanding color relationships' },
    { name: 'Prototyping', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Creating interactive mockups' },
    { name: 'Motion Design', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Animated visual design' },
    { name: 'Storyboarding', departmentId: departments['Creative'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Visual storytelling' },
    
    // === DATA - Analytics & BI ===
    { name: 'SQL', departmentId: departments['Data'].id, categoryId: categories['Database'].id, category: 'Database', description: 'Database query language' },
    { name: 'Tableau', departmentId: departments['Data'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Data visualization platform' },
    { name: 'Power BI', departmentId: departments['Data'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Microsoft BI tool' },
    { name: 'Looker', departmentId: departments['Data'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Google BI platform' },
    { name: 'Metabase', departmentId: departments['Data'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Open-source BI tool' },
    
    // === DATA - Data Science ===
    { name: 'pandas', departmentId: departments['Data'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Python data analysis library' },
    { name: 'NumPy', departmentId: departments['Data'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Python numerical computing' },
    { name: 'scikit-learn', departmentId: departments['Data'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Machine learning library' },
    { name: 'TensorFlow', departmentId: departments['Data'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Google ML framework' },
    { name: 'PyTorch', departmentId: departments['Data'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Meta ML framework' },
    { name: 'Apache Spark', departmentId: departments['Data'].id, categoryId: categories['Framework'].id, category: 'Framework', description: 'Big data processing' },
    { name: 'Jupyter', departmentId: departments['Data'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Interactive notebooks' },
    { name: 'R', departmentId: departments['Data'].id, categoryId: categories['Programming Language'].id, category: 'Programming Language', description: 'Statistical programming' },
    
    // === FINANCE ===
    { name: 'Excel', departmentId: departments['Finance'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Spreadsheet analysis' },
    { name: 'QuickBooks', departmentId: departments['Finance'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Accounting software' },
    { name: 'SAP', departmentId: departments['Finance'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Enterprise resource planning' },
    { name: 'Financial Modeling', departmentId: departments['Finance'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Building financial models' },
    { name: 'Budgeting', departmentId: departments['Finance'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Budget planning & tracking' },
    { name: 'Financial Analysis', departmentId: departments['Finance'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Analyzing financial data' },
    
    // === PEOPLE ===
    { name: 'Workday', departmentId: departments['People'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'HR management platform' },
    { name: 'BambooHR', departmentId: departments['People'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'HR software' },
    { name: 'Greenhouse', departmentId: departments['People'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'Recruiting platform' },
    { name: 'Lever', departmentId: departments['People'].id, categoryId: categories['Analytics'].id, category: 'Analytics', description: 'ATS and CRM' },
    { name: 'Recruiting', departmentId: departments['People'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Talent acquisition' },
    { name: 'Interviewing', departmentId: departments['People'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Conducting interviews' },
    { name: 'Onboarding', departmentId: departments['People'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Employee onboarding process' },
    { name: 'Employee Relations', departmentId: departments['People'].id, categoryId: categories['Soft Skill'].id, category: 'Soft Skill', description: 'Managing employee relations' }
  ]

  let skillsCreated = 0
  let skillsSkipped = 0
  
  for (const skill of skillsData) {
    const existing = await prisma.skill.findFirst({
      where: { 
        name: skill.name,
        departmentId: skill.departmentId
      }
    })
    
    if (!existing) {
      await prisma.skill.create({ data: skill })
      skillsCreated++
    } else {
      skillsSkipped++
    }
  }
  
  console.log(`   ✅ Created ${skillsCreated} skills`)
  console.log(`   ⏭️  Skipped ${skillsSkipped} skills (already exist)`)

  // =====================================================
  // INTERNSHIPS
  // =====================================================
  console.log('\n💼 Creating internships...')

  const internships = [
    {
      title: 'Software Engineering Intern',
      department: 'Engineering',
      departmentId: departments['Engineering'].id,
      description: 'Join our engineering team and work on cutting-edge web applications using React, TypeScript, and Node.js. You\'ll collaborate with senior engineers on real projects that impact thousands of users.\n\nWhat you\'ll do:\n• Develop new features for our platform\n• Write clean, maintainable code\n• Participate in code reviews\n• Learn industry best practices',
      requirements: '• Currently pursuing a degree in Computer Science or related field\n• Strong foundation in JavaScript/TypeScript\n• Familiarity with React or similar frameworks\n• Good problem-solving skills\n• Excellent communication abilities',
      location: 'Hybrid - San Francisco, CA',
      duration: '3 months (Summer 2025)',
      isOpen: true
    },
    {
      title: 'Frontend Developer Intern',
      department: 'Engineering',
      departmentId: departments['Engineering'].id,
      description: 'Build beautiful, responsive user interfaces using modern frontend technologies. Work with React, Next.js, and Tailwind CSS.\n\nResponsibilities:\n• Implement pixel-perfect designs\n• Optimize performance\n• Write component tests\n• Collaborate with designers',
      requirements: '• HTML, CSS, JavaScript proficiency\n• React experience\n• Understanding of responsive design\n• Eye for detail\n• Portfolio of web projects',
      location: 'Remote',
      duration: '3-6 months',
      isOpen: true
    },
    {
      title: 'Backend Developer Intern',
      department: 'Engineering',
      departmentId: departments['Engineering'].id,
      description: 'Build robust APIs and services. Work with Node.js, PostgreSQL, and cloud infrastructure.\n\nYou\'ll work on:\n• API development\n• Database design\n• System optimization\n• Integration testing',
      requirements: '• Node.js or Python experience\n• Database knowledge\n• Understanding of REST APIs\n• Problem-solving skills\n• CS fundamentals',
      location: 'Hybrid - New York, NY',
      duration: '3 months',
      isOpen: true
    },
    {
      title: 'Mobile Development Intern',
      department: 'Engineering',
      departmentId: departments['Engineering'].id,
      description: 'Build native mobile applications for iOS and Android. Work with React Native and modern mobile development practices.\n\nProjects include:\n• Feature development\n• Bug fixes and optimization\n• UI implementation\n• Testing and QA',
      requirements: '• CS or related degree in progress\n• React Native or native mobile experience\n• JavaScript/TypeScript skills\n• Understanding of mobile UI/UX\n• Passion for mobile technology',
      location: 'On-site - Austin, TX',
      duration: 'Summer 2025 (12 weeks)',
      isOpen: true
    },
    {
      title: 'DevOps Engineering Intern',
      department: 'Engineering',
      departmentId: departments['Engineering'].id,
      description: 'Learn cloud infrastructure and deployment automation. Work with Kubernetes, Docker, and CI/CD pipelines.\n\nWhat you\'ll learn:\n• Cloud infrastructure (AWS/GCP)\n• Container orchestration\n• CI/CD automation\n• Infrastructure as code',
      requirements: '• CS or Engineering student\n• Linux/Unix familiarity\n• Scripting knowledge (Python, Bash)\n• Interest in cloud technologies\n• Problem-solving mindset',
      location: 'Remote',
      duration: '3 months',
      isOpen: true
    },
    {
      title: 'Digital Marketing Intern',
      department: 'Marketing',
      departmentId: departments['Marketing'].id,
      description: 'Help us grow our digital presence and reach new audiences. Work on paid advertising, social media, and analytics.\n\nKey activities:\n• Google & Facebook Ads management\n• Social media campaigns\n• Performance analytics\n• A/B testing',
      requirements: '• Marketing or Business major\n• Analytical mindset\n• Social media savvy\n• Google Analytics knowledge\n• Excellent communication',
      location: 'Hybrid - New York, NY',
      duration: '3 months (Fall 2025)',
      isOpen: true
    },
    {
      title: 'Content Marketing Intern',
      department: 'Marketing',
      departmentId: departments['Marketing'].id,
      description: 'Create engaging content for our blog, website, and marketing materials. Perfect for aspiring writers and content creators.\n\nContent types:\n• Blog posts and articles\n• Product descriptions\n• Email campaigns\n• Social media copy',
      requirements: '• English, Journalism, or Communications major\n• Excellent writing skills\n• SEO knowledge (preferred)\n• Research abilities\n• Creative mindset',
      location: 'Remote',
      duration: 'Flexible (10-15 weeks)',
      isOpen: true
    },
    {
      title: 'Social Media Intern',
      department: 'Marketing',
      departmentId: departments['Marketing'].id,
      description: 'Manage and grow our social media presence across platforms. Create engaging content and build community.\n\nResponsibilities:\n• Content calendar management\n• Community engagement\n• Trend monitoring\n• Performance reporting',
      requirements: '• Active on multiple platforms\n• Content creation skills\n• Understanding of algorithms\n• Creative eye\n• Analytics experience',
      location: 'Hybrid - Los Angeles, CA',
      duration: '3-4 months',
      isOpen: true
    },
    {
      title: 'UI/UX Design Intern',
      department: 'Creative',
      departmentId: departments['Creative'].id,
      description: 'Work alongside our design team to create beautiful, user-centered experiences. You\'ll be involved in the entire design process from research to final implementation.\n\nResponsibilities:\n• Design UI/UX for web and mobile\n• Create wireframes and prototypes\n• Conduct user research\n• Collaborate with engineers',
      requirements: '• Portfolio showcasing UI/UX work\n• Proficiency in Figma or Sketch\n• Understanding of design principles\n• User-centered design mindset\n• Strong attention to detail',
      location: 'On-site - San Francisco, CA',
      duration: '3-6 months',
      isOpen: true
    },
    {
      title: 'Graphic Design Intern',
      department: 'Creative',
      departmentId: departments['Creative'].id,
      description: 'Create stunning visual designs for marketing, product, and brand materials.\n\nProjects include:\n• Marketing collateral\n• Social media graphics\n• Brand assets\n• Presentation designs',
      requirements: '• Design portfolio required\n• Adobe Creative Suite proficiency\n• Strong typography skills\n• Brand awareness\n• Creative problem-solving',
      location: 'Hybrid - Chicago, IL',
      duration: '3 months',
      isOpen: true
    },
    {
      title: 'Video Production Intern',
      department: 'Creative',
      departmentId: departments['Creative'].id,
      description: 'Create engaging video content for marketing, social media, and product demos.\n\nYou\'ll work on:\n• Video shooting and editing\n• Motion graphics\n• Social media content\n• Product tutorials',
      requirements: '• Video editing experience (Premiere/Final Cut)\n• After Effects knowledge\n• Storytelling abilities\n• Equipment handling\n• Creative portfolio',
      location: 'On-site - Los Angeles, CA',
      duration: 'Summer 2025',
      isOpen: true
    },
    {
      title: 'Motion Graphics Intern',
      department: 'Creative',
      departmentId: departments['Creative'].id,
      description: 'Create animated content and motion graphics for digital platforms.\n\nResponsibilities:\n• Animation creation\n• Motion graphics for ads\n• UI animations\n• Video intros/outros',
      requirements: '• After Effects proficiency\n• Animation principles\n• Design sensibility\n• Creative portfolio\n• Cinema 4D (bonus)',
      location: 'Remote',
      duration: '3-4 months',
      isOpen: true
    },
    {
      title: 'Data Science Intern',
      department: 'Data',
      departmentId: departments['Data'].id,
      description: 'Dive into our data and help us uncover insights that drive business decisions. You\'ll work with large datasets and modern ML tools.\n\nYou\'ll work on:\n• Data analysis and visualization\n• Building predictive models\n• A/B testing analysis\n• Dashboard creation',
      requirements: '• Studying Statistics, Math, CS, or related field\n• Python programming skills\n• Knowledge of pandas, numpy, scikit-learn\n• SQL experience\n• Analytical mindset',
      location: 'Remote',
      duration: 'Flexible (12-16 weeks)',
      isOpen: true
    },
    {
      title: 'Business Intelligence Intern',
      department: 'Data',
      departmentId: departments['Data'].id,
      description: 'Help build dashboards and reports that drive business insights. Work with SQL, Tableau, and data visualization.\n\nKey projects:\n• Dashboard development\n• Data pipeline optimization\n• Report automation\n• Stakeholder collaboration',
      requirements: '• Business Analytics or related field\n• SQL experience\n• Tableau or Power BI knowledge\n• Data visualization skills\n• Business acumen',
      location: 'Hybrid - Seattle, WA',
      duration: '3-6 months',
      isOpen: true
    },
    {
      title: 'Finance & Accounting Intern',
      department: 'Finance',
      departmentId: departments['Finance'].id,
      description: 'Gain hands-on experience in financial analysis, reporting, and budget management.\n\nYou\'ll work on:\n• Financial reporting\n• Budget analysis\n• Invoice processing\n• Expense tracking',
      requirements: '• Finance or Accounting major\n• Excel proficiency\n• Strong analytical skills\n• Attention to detail\n• CPA track (preferred)',
      location: 'Hybrid - Chicago, IL',
      duration: 'Spring/Summer 2025',
      isOpen: true
    },
    {
      title: 'HR & Recruiting Intern',
      department: 'People',
      departmentId: departments['People'].id,
      description: 'Support our HR team with recruiting, onboarding, and employee engagement initiatives.\n\nResponsibilities:\n• Candidate sourcing\n• Interview coordination\n• Onboarding support\n• HR analytics',
      requirements: '• HR, Psychology, or Business major\n• Strong interpersonal skills\n• Organized and detail-oriented\n• Interest in people operations\n• Confidentiality awareness',
      location: 'On-site - San Francisco, CA',
      duration: '3-4 months',
      isOpen: true
    }
  ]

  // First delete existing internships to avoid duplicates
  const existingCount = await prisma.internship.count()
  if (existingCount > 0) {
    console.log(`   ⏭️  Skipping internships (${existingCount} already exist)`)
  } else {
    for (const internship of internships) {
      await prisma.internship.create({ data: internship })
    }
    console.log(`   ✅ Created ${internships.length} internships`)
  }

  // =====================================================
  // FINAL STATS
  // =====================================================
  const finalStats = {
    departments: await prisma.department.count(),
    categories: await prisma.skillCategory.count(),
    skills: await prisma.skill.count(),
    internships: await prisma.internship.count(),
    users: await prisma.user.count(),
    applications: await prisma.application.count()
  }
  
  console.log('\n📊 Database Stats:')
  console.log(`   Departments: ${finalStats.departments}`)
  console.log(`   Skill Categories: ${finalStats.categories}`)
  console.log(`   Skills: ${finalStats.skills}`)
  console.log(`   Internships: ${finalStats.internships}`)
  console.log(`   Users: ${finalStats.users}`)
  console.log(`   Applications: ${finalStats.applications}`)
  console.log('\n✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

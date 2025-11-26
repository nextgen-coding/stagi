import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('Usage: npm run db:make-admin <email>')
    process.exit(1)
  }
  
  try {
    console.log(`🔍 Looking for user with email: ${email}`)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      console.log('\n💡 Available users:')
      const allUsers = await prisma.user.findMany({
        select: {
          email: true,
          firstName: true,
          lastName: true,
          role: true
        }
      })
      
      if (allUsers.length === 0) {
        console.log('   No users found. Please sign up first.')
      } else {
        for (const u of allUsers) {
          console.log(`   - ${u.email} (${u.firstName} ${u.lastName}) - ${u.role}`)
        }
      }
      
      process.exit(1)
    }
    
    if (user.role === 'ADMIN') {
      console.log(`✅ User ${email} is already an ADMIN`)
      process.exit(0)
    }
    
    // Update to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    
    console.log(`✅ Successfully updated ${email} to ADMIN role`)
    console.log(`   Name: ${updatedUser.firstName} ${updatedUser.lastName}`)
    console.log(`   Role: ${updatedUser.role}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()

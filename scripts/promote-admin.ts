import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function selectUserToMakeAdmin() {
  try {
    console.log('\n🔍 Fetching all users from database...\n')
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    if (users.length === 0) {
      console.log('❌ No users found in the database.')
      console.log('💡 Please sign up at http://localhost:3000/sign-up first.')
      process.exit(0)
    }
    
    console.log('📋 Available Users:\n')
    
    type UserFromDB = typeof users[number]
    
    users.forEach((user: UserFromDB, index: number) => {
      const roleColor = user.role === 'ADMIN' ? '\x1b[34m' : '\x1b[32m' // Blue for admin, green for candidate
      const resetColor = '\x1b[0m'
      
      console.log(`  ${index + 1}. ${user.firstName} ${user.lastName}`)
      console.log(`     Email: ${user.email}`)
      console.log(`     Role: ${roleColor}${user.role}${resetColor}`)
      console.log(`     Joined: ${user.createdAt.toLocaleDateString()}`)
      console.log('')
    })
    
    const answer = await question('Enter the number of the user to make ADMIN (or "q" to quit): ')
    
    if (answer.toLowerCase() === 'q') {
      console.log('\n👋 Cancelled.')
      process.exit(0)
    }
    
    const selectedIndex = parseInt(answer) - 1
    
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= users.length) {
      console.log('\n❌ Invalid selection. Please enter a valid number.')
      process.exit(1)
    }
    
    const selectedUser = users[selectedIndex]
    
    if (selectedUser.role === 'ADMIN') {
      console.log(`\n✅ ${selectedUser.firstName} ${selectedUser.lastName} is already an ADMIN.`)
      process.exit(0)
    }
    
    // Confirm
    const confirm = await question(`\n⚠️  Are you sure you want to make ${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email}) an ADMIN? (yes/no): `)
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('\n❌ Operation cancelled.')
      process.exit(0)
    }
    
    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: selectedUser.id },
      data: { role: 'ADMIN' }
    })
    
    console.log('\n✅ Success!')
    console.log(`   ${updatedUser.firstName} ${updatedUser.lastName} is now an ADMIN`)
    console.log(`   Email: ${updatedUser.email}`)
    console.log(`   Role: \x1b[34mADMIN\x1b[0m`)
    console.log('\n🎉 They can now access admin features!')
    
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

selectUserToMakeAdmin()

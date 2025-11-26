/**
 * Migration script to convert FILE type to PDF type
 * Run this before updating the schema
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration of FILE field types...')
  
  // Find all fields with FILE type
  const fileFields = await prisma.$queryRaw<Array<{ id: string; label: string }>>`
    SELECT id, label FROM application_fields WHERE type = 'FILE'
  `
  
  console.log(`Found ${fileFields.length} fields with FILE type`)
  
  if (fileFields.length === 0) {
    console.log('No FILE fields to migrate')
    return
  }
  
  // Update all FILE fields to PDF (since most files are PDFs in applications)
  const result = await prisma.$executeRaw`
    UPDATE application_fields SET type = 'PDF' WHERE type = 'FILE'
  `
  
  console.log(`Successfully migrated ${result} FILE fields to PDF type`)
  console.log('Migration complete!')
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

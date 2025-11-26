import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Use raw SQL to temporarily change FILE to TEXT
  await prisma.$executeRawUnsafe(`
    UPDATE application_fields 
    SET type = 'TEXT'::"FieldType"
    WHERE type = 'FILE'::"FieldType"
  `)
  
  console.log('Successfully updated FILE fields to TEXT temporarily')
  console.log('Now you can run: npx prisma db push --accept-data-loss')
  console.log('Then manually update those TEXT fields to IMAGE or PDF as needed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

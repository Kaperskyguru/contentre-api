import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedTemplates = async () => {
  await prisma.template.createMany({
    data: [
      {
        title: 'Blank',
        content: '<h1>Blank</h1>',
        userId: 'a3f03bc2-2883-45fd-b073-e2673dee7767',
        visibility: 'PUBLIC'
      }
    ],
    skipDuplicates: true
  })
}

const seed = async () => {
  console.log('here')
  await seedTemplates()
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

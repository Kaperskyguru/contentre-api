import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedTemplates = async () => {
  const user = await prisma.user.create({
    data: {
      name: 'Admin Admin',
      username: 'admin',
      password: '$2b$10$cKsE9uzk.TTgtl.kgk15UeV5Adto8NVYTp3Wt3o2YxK9ZrSnx.sEi',
      email: 'test@test.com',
      emailConfirmed: true
    }
  })

  await prisma.template.createMany({
    data: [
      {
        title: 'Blank',
        content: '<h1>Blank</h1>',
        userId: user.id,
        visibility: 'PUBLIC'
      }
    ],
    skipDuplicates: true
  })
}

const seed = async () => {
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

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedTemplates = async () => {
  const sub = await prisma.subscription.findFirst({ where: { name: 'team' } })
  const user = await prisma.user.create({
    data: {
      name: 'Admin Admin',
      username: 'admin',
      password: '$2b$10$cKsE9uzk.TTgtl.kgk15UeV5Adto8NVYTp3Wt3o2YxK9ZrSnx.sEi',
      email: 'test@test.com',
      portfolioURL: `http://localhost:3000/admin`,
      subscriptionId: sub?.id!,
      emailConfirmed: true
    }
  })

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      activeTeam: {
        create: {
          role: 'ADMIN',
          user: {
            connect: { id: user?.id }
          },
          team: {
            create: {
              name: 'Personal'
            }
          }
        }
      }
    }
  })

  await prisma.template.createMany({
    data: [
      {
        title: 'Blank',
        content: '<h1>Blank</h1>',
        userId: updateUser.id,
        visibility: 'PUBLIC'
      }
    ],
    skipDuplicates: true
  })
}

const subscriptions = [
  {
    name: 'free'
  },
  {
    name: 'basic'
  },
  {
    name: 'pro'
  },
  {
    name: 'team'
  }
]
const seedSubscriptions = async () => {
  await prisma.subscription.createMany({
    data: subscriptions
  })
}

const seedFeatures = async () => {
  const proSub = await prisma.subscription.findFirst({ where: { name: 'pro' } })
  const teamSub = await prisma.subscription.findFirst({
    where: { name: 'team' }
  })
  const freeSub = await prisma.subscription.findFirst({
    where: { name: 'free' }
  })
  const basSub = await prisma.subscription.findFirst({
    where: { name: 'basic' }
  })

  const features = [
    {
      feature: 'TOTAL_CONTENTS',
      value: '12',
      subscriptionId: freeSub?.id!
    },

    {
      feature: 'TOTAL_CONTENTS',
      value: '50',
      subscriptionId: basSub?.id!
    },

    {
      feature: 'TOTAL_CONTENTS',
      value: 'unlimited',
      subscriptionId: proSub?.id!
    },

    {
      feature: 'TOTAL_CONTENTS',
      value: 'unlimited',
      subscriptionId: teamSub?.id!
    }
  ]
  await prisma.feature.createMany({
    data: features
  })
}

const seed = async () => {
  await seedSubscriptions()
  await seedTemplates()
  await seedFeatures()
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

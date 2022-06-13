import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedTemplates = async () => {
  const sub = await prisma.subscription.findFirst({ where: { name: 'Team' } })
  if (!sub) return
  const user = await prisma.user.create({
    data: {
      name: 'Admin Admin',
      username: 'admin',
      password: '$2b$10$cKsE9uzk.TTgtl.kgk15UeV5Adto8NVYTp3Wt3o2YxK9ZrSnx.sEi',
      email: 'test@test.com',
      portfolioURL: `http://localhost:3000/admin`,
      subscriptionId: sub?.id!, //Change subscriptionId tot activeSubscriptionId
      activeSubscriptionId: sub.id,
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
              name: 'Personal',
              // Add activeSubscriptionId
              activeSubscription: { connect: { id: sub?.id! } }
            }
          }
        }
      }
    }
  })

  await prisma.template.upsert({
    where: { slug: 'Default' },
    create: {
      title: 'Blank',
      content: '<h1>Blank</h1>',
      userId: updateUser.id,
      visibility: 'PUBLIC'
    },
    update: {}
  })
}

const subscriptions = [
  {
    name: 'Basic'
  },
  {
    name: 'Premium'
  },
  {
    name: 'Team'
  }
]
const seedSubscriptions = async () => {
  await prisma.subscription.createMany({
    data: subscriptions
  })
}

const seedFeatures = async () => {
  const premiumSub = await prisma.plan.findFirst({
    where: { name: 'Premium' }
  })
  const teamSub = await prisma.plan.findFirst({
    where: { name: 'Team' }
  })
  const basicSub = await prisma.plan.findFirst({
    where: { name: 'Basic' }
  })

  const features = [
    {
      feature: 'TOTAL_CONTENTS',
      value: '12',
      planId: basicSub?.id!
    },

    {
      feature: 'TOTAL_CONTENTS',
      value: 'unlimited',
      planId: premiumSub?.id!
    },

    {
      feature: 'TOTAL_CONTENTS',
      value: 'unlimited',
      planId: teamSub?.id!
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

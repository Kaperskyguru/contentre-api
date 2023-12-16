import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedTemplates = async () => {
  const plan = await prisma.plan.findFirst({ where: { name: 'Basic' } })

  if (!plan) return
  const user = await prisma.user.create({
    data: {
      name: 'Admin Admin',
      username: 'admin',
      password: '$2b$10$cKsE9uzk.TTgtl.kgk15UeV5Adto8NVYTp3Wt3o2YxK9ZrSnx.sEi',
      email: 'test@test.com',
      portfolioURL: `http://localhost:3000/admin`,
      emailConfirmed: true
    }
  })

  const sub = await prisma.subscription.create({
    data: {
      name: plan?.name!,
      userId: user?.id!,
      teamId: user.activeTeamId,
      planId: plan?.id!
    }
  })

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isPremium: true,
      activeSubscription: { connect: { id: sub?.id! } },
      subscription: { connect: { id: sub?.id! } },
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

  await prisma.notebook.create({
    data: {
      name: 'Personal Notebook',
      userId: updateUser.id,
      teamId: updateUser.activeTeamId
    }
  })

  await prisma.category.create({
    data: {
      name: 'Uncategorized',
      userId: updateUser.id,
      teamId: updateUser.activeTeamId
    }
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
  // await seedSubscriptions()
  // await seedTemplates()
  // await seedFeatures()
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

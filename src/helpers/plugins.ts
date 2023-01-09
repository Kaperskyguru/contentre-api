import { User, ConvertContentInput } from '@/types/modules'
import Medium from '@extensions/medium'
import Hashnode from '@extensions/hashnode'
import { PrismaClient } from '@prisma/client'
import Devto from '@extensions/devto'

export const Plugins = async (
  input: ConvertContentInput | any,
  { user, prisma }: { user: User; prisma: PrismaClient }
): Promise<void> => {
  const { apps } = input

  let post = null

  if (apps.isMain === 'devto') {
    post = await devto(input, prisma, user)

    if (!post) return

    delete apps.devto
  }

  if (apps.isMain === 'hashnode') {
    post = await hashnode(input, prisma, user)

    if (!post) return

    delete apps.hashnode
  }

  if (apps.isMain === 'medium') {
    post = await medium(input, prisma, user)
    if (!post) return

    delete apps.medium
  }

  // Fire the remaining plugins
  input.canonicalUrl = post?.url ?? undefined

  await activatePlugins(input, prisma, user)
}

const activatePlugins = async (
  input: any,
  prisma: PrismaClient,
  user: User
) => {
  await devto(input, prisma, user)
  await hashnode(input, prisma, user)
  await medium(input, prisma, user)
}

const devto = async (input: any, prisma: PrismaClient, user: User) => {
  const { apps } = input
  if (apps?.devto && apps.devto.action === 'Publish') {
    const DevTo = await prisma.connectedApp.findFirst({
      where: { teamId: user.activeTeamId!, name: 'Devto', slug: 'devto' }
    })
    return await new Devto(DevTo!).publish(input)
  }
}

const hashnode = async (input: any, prisma: PrismaClient, user: User) => {
  const { apps } = input
  if (apps?.hashnode && apps.hashnode.action === 'Publish') {
    const HashNode = await prisma.connectedApp.findFirst({
      where: { teamId: user.activeTeamId!, name: 'Hashnode', slug: 'hashnode' }
    })

    return await new Hashnode(HashNode!).publish(input)
  }
}

const medium = async (input: any, prisma: PrismaClient, user: User) => {
  const { apps } = input
  if (apps?.medium && apps.medium.action === 'Publish') {
    const medium = await prisma.connectedApp.findFirst({
      where: { teamId: user.activeTeamId!, name: 'Medium', slug: 'medium' }
    })

    return await new Medium(medium!).publish(input)
  }
}

export default Plugins

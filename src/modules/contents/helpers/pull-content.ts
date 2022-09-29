import { Context } from '@/types'
import { PullContentInput } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import Hashnode from '@extensions/hashnode'
import Devto from '@extensions/devto'
import Medium from '@extensions/medium'

export const ImportContent = async (
  { plugins }: PullContentInput,
  context: Context & Required<Context>
): Promise<Array<any>> => {
  const { prisma, user } = context

  if (!user) throw new ApolloError('You must be logged in.', '401')

  const contentArr: any = []
  let innerContentArr: any = []
  innerContentArr = plugins.map(async (item) => {
    //  item?.data
    const name = item?.name
    const data = item?.data!

    switch (name) {
      case 'hashnode':
        if (data.action === 'Retrieve') {
          const hashnodeApp = await prisma.connectedApp.findFirst({
            where: { teamId: user.activeTeamId!, slug: name },
            include: { app: true }
          })
          const hashnode = new Hashnode(hashnodeApp!)
          if (data.slug) {
            contentArr.push(await hashnode.get(data.slug))
            break
          }
          const articles = await hashnode.all(data?.username!, data?.page!)
          contentArr.push(articles)
        }

        break

      case 'devto':
        if (data.action === 'Retrieve') {
          const devtoApp = await prisma.connectedApp.findFirst({
            where: { teamId: user.activeTeamId!, slug: name },
            include: { app: true }
          })
          const devto = new Devto(devtoApp!)
          if (data.slug) {
            contentArr.push(await devto.get(data.contentId!))
            break
          }

          if (data.contentStatus?.includes('PUBLISHED')) {
            const articles = await devto.getPublished(
              data?.per_page!,
              data?.page!
            )
            contentArr.push(articles)
            break
          }

          if (data.contentStatus?.includes('DRAFTS')) {
            const articles = await devto.getDrafts(data?.per_page!, data?.page!)
            contentArr.push(articles)
            break
          }

          const articles = await devto.all(data?.per_page!, data?.page!)
          contentArr.push(articles)
          break
        }

        break

      case 'medium':
        if (data.action === 'Retrieve') {
          const mediumApp = await prisma.connectedApp.findFirst({
            where: { teamId: user.activeTeamId!, slug: name },
            include: { app: true }
          })

          const medium = new Medium(mediumApp!)

          //   if (data.slug) {
          //     contentArr.push(medium.getPosts(data.contentId!))
          //     return
          //   }
          const articles = await medium.getPosts()
          contentArr.push(articles)
        }
        break
    }
    return contentArr
  })

  await Promise.all(innerContentArr)
  return contentArr?.flat()
}

export default ImportContent

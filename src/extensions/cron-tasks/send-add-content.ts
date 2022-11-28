import { chunkArray, useErrorParser } from '@/helpers'
import { prisma } from '@/config'
import { logError } from '@/helpers/logger'
import sendMailjetEmail from '@extensions/mail-service/send-mailjet-email'
import { ApolloError } from 'apollo-server-errors'

export default async (): Promise<void> => {
  // get all users without added content

  try {
    const users = await prisma.user.findMany({
      where: { contents: { none: {} } },
      select: { email: true, username: true, name: true }
    })

    const messageData = users.map((user) => ({
      to: user.email,
      username: user.username,
      name: user.name,
      variables: {
        NAME: user.name,
        USERNAME: user.username
      }
    }))

    //TODO: Use queues
    const chunkValue = Math.floor(messageData.length / 4.4)
    const newArrays = chunkArray(messageData, chunkValue)

    await Promise.all(
      newArrays.map(async (message: any) => {
        const res = await sendMailjetEmail(
          {
            templateId: '4371325',
            data: message,
            subject: "What's the #1 thing you need in your portfolio?"
          },
          true
        )
      })
    )
  } catch (error) {
    logError('sendAddContent %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}

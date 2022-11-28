import { chunkArray, useErrorParser } from '@/helpers'
import { logError } from '@/helpers/logger'
import { prisma } from '@/config'
import sendMailjetEmail from '@extensions/mail-service/send-mailjet-email'
import { ApolloError } from 'apollo-server-errors'

export default async (): Promise<void> => {
  // get all users without completed profile

  try {
    const users = await prisma.user.findMany({
      where: { hasFinishedOnboarding: false },
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

    const chunkValue = Math.floor(messageData.length / 4.4)
    const newArrays = chunkArray(messageData, chunkValue)

    //TODO: Use queues

    await Promise.all(
      newArrays.map(async (message: any) => {
        const res = await sendMailjetEmail(
          {
            templateId: '4371167',
            data: message,
            subject: 'Stay fresh by updating your profile'
          },
          true
        )
      })
    )
  } catch (error) {
    logError('sendUpdateProfile %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}

import { useErrorParser } from '@/helpers'
import { logError } from '@/helpers/logger'
import sendMailjetEmail from '@extensions/mail-service/send-mailjet-email'
import { PrismaClient } from '@prisma/client'
import { ApolloError } from 'apollo-server-errors'

export default async (prisma: PrismaClient): Promise<number> => {
  // get all users with completed profile

  try {
    const users = await prisma.user.findMany({
      where: { hasFinishedOnboarding: false }
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

    const res = await sendMailjetEmail(
      {
        templateId: '4371167',
        data: messageData,
        subject: 'Stay fresh by updating your profile'
      },
      true
    )

    if (!res?.body?.Messages) return 0

    const count = res.body.Messages.filter(
      (message: any) => message.Status === 'success'
    )

    return count.length
  } catch (error) {
    logError('sendSegment %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}

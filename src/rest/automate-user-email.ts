import { prisma } from '@/config'
import sendMailjetEmail from '@extensions/mail-service/send-mailjet-email'
import { subWeeks } from 'date-fns'

export default async () => {
  // get All users without completed profiles

  const users = await prisma.user.findMany({
    where: {
      hasFinishedOnboarding: false,
      createdAt: {
        lte: subWeeks(new Date(), 2)
      }
    },
    include: {
      contents: true
    }
  })

  const usersToSend = users.map((user) => ({
    to: user.email,
    variables: {
      NAME: user.name,
      JOB: user.jobTitle,
      BIO: user.bio,
      AVATAR: user.avatarURL,
      ADDRESS: user.homeAddress,
      NUMBER: user.phoneNumber,
      CONTENT: user.contents.length > 0
    }
  }))

  console.log(
    usersToSend,
    subWeeks(new Date(), 2),
    new Date(Date.now() + 12096e5)
  )

  //   const mailResponse = sendMailjetEmail(
  //     {
  //       subject: '',
  //       templateId: '789087'
  //     },
  //     usersToSend
  //   )
}

import { environment } from '@/helpers/environment'
import { logError } from '@/helpers/logger'
import { User } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import nodemailer from 'nodemailer'
import URL from 'url-parse'
import forgotPassword from './email-templates/forgot-password'

interface GenerateEmailLink {
  email: String
  token: String
}

interface SendEmail {
  user: User
  token: String
}

interface MailOptions {
  from: any
  to: any
  subject: any
  html: any
}

const generateEmailLink = ({ email, token }: GenerateEmailLink) => {
  const url =
    process.env.FRONTEND_URL + '/reset/?token=' + token + '&email=' + email
  return URL(url).href
}

export default async ({ user, token }: SendEmail) => {
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: environment.mail?.host || 'smtp.mailtrap.io',
      port: environment.mail?.port || 2525,
      auth: {
        user: environment.mail?.username || '1a2b3c4d5e6f7g', //generated by Mailtrap
        pass: environment.mail?.password || '1a2b3c4d5e6f7g' //generated by Mailtrap
      }
    })

    const message = {
      to_name: user.name,
      link: generateEmailLink({ email: user.email, token })
    }

    // create message
    var mailOptions: MailOptions = {
      from: `"${process.env.APP_NAME}" <no-reply@contentre.io>`,
      to: user.email,
      subject: `${process.env.APP_NAME} Password Reset`,
      html: forgotPassword(message)
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logError('sendEmail %o', { mailOptions, error })
        reject(new ApolloError('try email again later', '500', error))
        return
      }

      resolve(info)
    })
  })
}

import { environment } from '@/helpers/environment'
import { logError } from '@/helpers/logger'
import { User } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import nodemailer from 'nodemailer'
import URL from 'url-parse'
import forgotPassword from '@extensions/mail-service/email-templates/forgot-password'
import passwordChanged from '@extensions/mail-service/email-templates/password-changed'
import welcome from '@extensions/mail-service/email-templates/welcome'
import SendGrid from '@sendgrid/mail'
import verificationEmail from './email-templates/verification-email'
interface GenerateEmailLink {
  email: string
  token: string
  BASE_URL: string
}

interface SendEmail {
  to: string
  template: string
  subject?: string
  variables?: any
}

interface MailOptions {
  from: any
  to: any
  subject: any
  html: any
}

interface SelectTemplate {
  template: string
  variables?: any
}

const generateEmailLink = ({ email, token, BASE_URL }: GenerateEmailLink) => {
  const url = BASE_URL + '/reset/?token=' + token
  return URL(url).href
}

export default async ({ to, template, variables }: SendEmail) => {
  let subject = ``

  const selectTemplate = async ({ template, variables }: SelectTemplate) => {
    switch (template) {
      case 'forgot-password':
        subject += `Password Reset`
        return forgotPassword(variables)
      case 'email-verification':
        subject += `Email Verification`
        return verificationEmail(variables)
      case 'password-changed':
        subject += `Password Changed`
        return passwordChanged(variables)
      case 'welcome':
        subject += `Welcome to Contentre!`
        return welcome(variables)
    }
  }

  const temp = await selectTemplate({ template, variables })

  new Promise((resolve, reject) => {
    // create message
    var mailOptions: MailOptions = {
      from: `"${process.env.APP_NAME}" <info@contentre.io>`,
      to,
      subject,
      html: temp
    }

    // if (environment.mail?.type === 'send') {
    //   SendGrid.setApiKey(environment.mail?.sendAPIKey!)
    //   console.log('here')
    //   SendGrid.send(mailOptions).then(
    //     (info) => {
    //       console.error(info)
    //       resolve(info)
    //     },
    //     (error) => {
    //       console.error(error)

    //       if (error.response) {
    //         console.error(error.response.body)
    //         reject(new ApolloError(error.response.body))
    //       }
    //     }
    //   )

    //   return
    // }

    // if (environment.context.includes('DEVELOP')) {
    const transporter = nodemailer.createTransport({
      host: environment.mail?.host || 'smtp.mailtrap.io',
      port: environment.mail?.port || 2525,
      auth: {
        user: environment.mail?.username || '1a2b3c4d5e6f7g', //generated by Mailtrap
        pass: environment.mail?.password || '1a2b3c4d5e6f7g' //generated by Mailtrap
      }
    })

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logError('sendEmail %o', { mailOptions, error })
        reject(new ApolloError('try email again later', '500', error))
        return
      }

      resolve(info)
    })
    // }
  })
}

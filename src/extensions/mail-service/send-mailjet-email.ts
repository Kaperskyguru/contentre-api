import { environment } from '@/helpers/environment'
const Mailjet = require('node-mailjet')

interface SendEmail {
  subject: string
  templateId: string
  to?: string
  variables?: any
  data?: any
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

export default async (
  { to, variables, templateId, subject, data }: SendEmail,
  bulk: Boolean = false
): Promise<any> => {
  const mailjet = Mailjet.connect(
    environment.mailjet.apiKey,
    environment.mailjet.apiSecret
  )

  let request = null

  if (bulk) {
    request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: data.map((item: any) => ({
        From: {
          Email: environment.mail?.sender ?? 'info@contentre.io',
          Name: environment.appName ?? 'Contentre'
        },
        To: [
          {
            Email: item.to,
            Name: item.variables?.NAME ?? ''
          }
        ],
        Subject: subject ?? item.subject,
        TemplateID: Number(templateId),
        TemplateLanguage: true,
        Variables: item.variables
      }))
    })
  } else
    request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: environment.mail?.sender ?? 'info@contentre.io',
            Name: environment.appName ?? 'Contentre'
          },
          To: [
            {
              Email: to,
              Name: variables?.to_name ?? ''
            }
          ],
          Subject: subject ?? '',
          TemplateID: Number(templateId),
          TemplateLanguage: true,
          Variables: variables
        }
      ]
    })

  return request
}

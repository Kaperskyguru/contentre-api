import { useErrorParser } from '@/helpers'
import { logError, logHelper } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import MailChimp from '@mailchimp/mailchimp_marketing'
import { environment } from '@/helpers/environment'

interface MailChimp {
  name: string
  email: string
  tags?: Array<string>
}
export default async (data: MailChimp): Promise<boolean> => {
  const isProduction = environment.context === 'PRODUCTION'

  if (!isProduction) {
    logHelper('MailChimp %o', {
      data
    })

    return false
  }

  try {
    MailChimp.setConfig({
      apiKey: environment.mailchimp.key,
      server: environment.mailchimp.server || 'us1'
    })

    await MailChimp.lists.addListMember(environment.mailchimp.id, {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.name.split(' ')[0] ?? '',
        LNAME: data.name.split(' ')[1] ?? '',
        NAME: data.name
      },
      tags: data.tags ? data.tags : []
    })
    return true
  } catch (e) {
    logError('MailChimp %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}

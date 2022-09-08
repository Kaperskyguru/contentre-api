import { logError, logHelper } from '@/helpers/logger'
import MailChimp from '@mailchimp/mailchimp_marketing'
import { environment } from '@/helpers/environment'
import crypto from 'crypto'

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

    const emailHash = crypto.createHash('md5').update(data.email).digest('hex')
    await MailChimp.lists.setListMember(environment.mailchimp.id, emailHash, {
      status_if_new: 'subscribed',
      email_address: data.email,
      merge_fields: {
        FNAME: data.name.split(' ')[0] ?? '',
        LNAME: data.name.split(' ')[1] ?? '',
        NAME: data.name
      }
    })

    await MailChimp.lists.updateListMemberTags(
      environment.mailchimp.id,
      emailHash,
      {
        tags: data.tags
          ? data.tags.map((tag) => ({ name: tag, status: 'active' }))
          : []
      }
    )
    return true
  } catch (e) {
    logError('MailChimp %o', e)
    return false
  }
}

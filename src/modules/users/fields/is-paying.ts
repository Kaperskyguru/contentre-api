import { Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'

export default async (parent: User): Promise<Maybe<boolean>> => {
  logResolver('User.paying')

  // Check trail
  const isTrial =
    parent.subscription?.name !== 'free' &&
    parent.hasTrial &&
    parent.trialEndDate > Date.now()

  const paying =
    !isTrial &&
    parent.subscriptionId != null &&
    parent.subscription?.expiry > Date.now()

  return paying
}

import { Maybe, User } from '@modules-types'
import { logResolver } from '@helpers/logger'

export default async (parent: User): Promise<Maybe<boolean>> => {
  logResolver('User.isTrial')

  // Check trail
  return (
    parent.subscription?.name !== 'free' &&
    parent?.hasTrial! &&
    parent?.trialEndDate > Date.now()
  )
}

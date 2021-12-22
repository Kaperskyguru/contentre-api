import { Maybe, User } from '@modules-types'
// import { readFileURL } from '@extensions/storage'
import { logResolver } from '@helpers/logger'

export default async (parent: User): Promise<Maybe<string>> => {
  logResolver('User.avatarURL')

  if (!parent.avatarURL) {
    return null
  }

  return parent.avatarURL //readFileURL(parent.avatarURL)
}

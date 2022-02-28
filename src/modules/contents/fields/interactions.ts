import { Content } from '@modules-types'
import { logResolver } from '@helpers/logger'

export default async (parent: Content): Promise<number> => {
  logResolver('Content.interactions')

  let count = 0

  count += parent!.likes!
  count += parent.comments!
  count += parent.shares!

  return count
}

import { useErrorParser } from '@/helpers'
import { environment } from '@helpers/environment'
import { logError, logHelper } from '@helpers/logger'
import { SendSegmentInput } from '@modules-types'
import Analytics from 'analytics-node'
import { ApolloError } from 'apollo-server-errors'

const analytics =
  environment.context === 'STAGING' && new Analytics(environment.segment)

export default async ({
  operation,
  data,
  groupId,
  eventName,
  pageName,
  userId
}: SendSegmentInput): Promise<boolean> => {
  if (!analytics) {
    logHelper('sendToSegment %o', {
      operation,
      eventName,
      groupId,
      pageName,
      userId,
      data
    })

    return false
  }

  try {
    switch (operation) {
      case 'identify':
        await analytics.identify({
          userId,
          traits: {
            ...data
          }
        })
        break
      case 'group':
        if (groupId)
          await analytics.group({
            groupId,
            userId,
            timestamp: new Date(),
            traits: {
              ...data
            }
          })
        break
      case 'track':
        if (eventName)
          await analytics.track({
            event: eventName,
            userId,
            properties: {
              ...data
            }
          })
        break
      case 'pageview':
        await analytics.page({
          userId,
          name: pageName!,
          properties: {
            ...data
          }
        })
        break
      default:
        logError('sendToSegment unhandled_operation', operation)
        return false
    }
    return true
  } catch (e) {
    logError('sendToSegment %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500')
  }
}

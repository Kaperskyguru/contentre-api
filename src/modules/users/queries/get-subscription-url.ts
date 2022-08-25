import { useErrorParser } from '@/helpers'
import Payment from '@extensions/payment'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetSubscriptionUrlArgs, SubscriptionUrl } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { plan, service }: QueryGetSubscriptionUrlArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<SubscriptionUrl> => {
  logQuery('getSubscriptionURL %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Get Plan
    const currentPlan = await prisma.plan.findFirst({
      where: { name: { equals: plan!, mode: 'insensitive' } }
    })
    if (!currentPlan) throw new ApolloError('Plan not found')

    // Get Service Plan ID based on Payment Channel
    const paymentChannel = await prisma.paymentChannel.findFirst({
      where: { planId: currentPlan.id, channel: service! }
    })

    if (!paymentChannel) throw new ApolloError('Plan Channel not found')

    const payment = new Payment(service!)

    const subscriptionURL = await payment.subscribe({
      email: user.email,
      amount: '600000',
      plan_id: paymentChannel?.paymentPlanId!
    })

    const { status, data } = subscriptionURL

    if (!subscriptionURL && !status)
      throw new ApolloError('subscriptionURL not found')
    return {
      url: data.authorization_url
    }
  } catch (e) {
    logError('getSubscriptionURL %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}

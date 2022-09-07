import { prisma } from '@/config'
import { Subscription, User } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import Paddle from './Paddle'
import Paystack from './Paystack'

interface SubscriptionPlan {
  amount: string
  plan_id: string
  email: string
}

interface Sub {
  id?: string
  name?: string
  paymentChannelId?: string
  planId?: string
  error: boolean
}

class Payment {
  service: any

  constructor(paymentService: String) {
    switch (paymentService) {
      case 'PAYSTACK':
        this.service = new Paystack(paymentService)
        break

      case 'PADDLE':
        this.service = new Paddle(paymentService)
        break
      default:
        break
    }
  }

  async getPlan(id: string) {
    try {
      return this.service.getPlan(id)
    } catch (error) {
      throw new ApolloError('Plan failed error')
    }
  }

  async subscribe(data: SubscriptionPlan) {
    try {
      return this.service.subscribe(data)
    } catch (error) {
      throw new ApolloError('Payment subscription error')
    }
  }

  async cancel() {}
  async webhook(data: any) {
    const payment = await this.service.webhook(data)

    if (payment) {
      switch (payment.status.toLowerCase()) {
        case 'subscription_payment_succeeded':
          // Create new Subscription
          return this.subscriptionSuccessful(payment)

        case 'subscription_cancelled':
          // Add a time to revert to free account
          break

        case 'payment_refunded':
          // Update subscription to old Expiry date
          break

        case 'subscription_payment_failed':
          // Do nothing, alert user
          console.log('ere')
          break

        case 'subscription_updated':
          // Update new Expiring date, check type for upgrade or downgrade
          break
      }
    }

    return false
  }

  private async getOrCreateSubscription(
    user: User,
    payment: any
  ): Promise<Sub> {
    const planChannel = await prisma.paymentChannel.findFirst({
      where: {
        paymentPlanId: payment.metadata?.plan.trim(),
        channel: payment.metadata?.channel
      },
      include: { plan: true }
    })

    if (!planChannel)
      return {
        error: true
      }

    let subscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          name: planChannel.plan?.name!,
          teamId: user.activeTeamId,
          planId: planChannel.plan?.id!,
          userId: user?.id,
          paymentChannelId: planChannel?.id!,
          expiry: payment.nextPaymentDate
        }
      })
    }

    return {
      id: subscription.id,
      name: planChannel.plan?.name!,
      paymentChannelId: planChannel?.id!,
      planId: planChannel.plan?.id!,
      error: false
    }
  }

  private async subscriptionSuccessful(payment: any) {
    try {
      const user = await prisma.user.findFirst({
        where: { email: payment.customerEmail }
      })

      if (!user) return false

      const subscription = await this.getOrCreateSubscription(user, payment)
      if (subscription.error) return false

      await prisma.subscription.update({
        where: { id: subscription?.id! },
        data: {
          name: subscription?.name!,
          teamId: user.activeTeamId,
          planId: subscription?.planId!,
          paymentChannelId: subscription?.paymentChannelId!,
          expiry: payment.nextPaymentDate
        }
      })

      return true
    } catch (error) {
      return false
    }
  }
}
export default Payment

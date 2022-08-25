import { prisma } from '@/config'
import { ApolloError } from 'apollo-server-errors'
import Paddle from './Paddle'
import Paystack from './Paystack'

interface Subscription {
  amount: string
  plan_id: string
  email: string
}

class Payment {
  service: any
  plan: string
  constructor(paymentService: String, plan: string = '') {
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
    this.plan = plan
  }

  //   PLN_pm8vah8nlzpdb5m

  async getPlan(id: string) {
    try {
      return this.service.getPlan(id)
    } catch (error) {
      throw new ApolloError('Plan failed error')
    }
  }

  async subscribe(data: Subscription) {
    try {
      return this.service.subscribe(data)
    } catch (error) {
      throw new ApolloError('Payment subscription error')
    }
  }

  async cancel() {}
  async webhook(data: any) {
    const payment = this.service.webhook(data)
    if (payment) {
      switch (payment) {
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
          break

        case 'subscription_updated':
          // Update new Expiring date, check type for upgrade or downgrade
          break
      }
    }

    return false
  }

  private async subscriptionSuccessful(payment: any) {
    // If new, create
    // else update

    try {
      const user = await prisma.user.findFirst({
        where: { email: payment.customerEmail }
      })

      if (!user) return false

      const plan = await prisma.plan.findFirst({
        where: { name: this.plan }
      })

      if (!plan) return false

      const planChannel = await prisma.paymentChannel.findFirst({
        where: { planId: plan?.id }
      })

      if (!planChannel) return false

      const sub = await prisma.subscription.create({
        data: {
          name: plan?.name!, // remove Plan Name
          userId: user?.id!,
          teamId: user.activeTeamId,
          planId: plan?.id!,
          paymentChannelId: planChannel?.paymentPlanId,
          expiry: payment.nextPaymentDate
        }
      })

      await prisma.user.update({
        where: { email: payment.customerEmail },
        data: {
          subscriptionId: sub.id
        },
        include: { activeSubscription: true }
      })
      return true
    } catch (error) {
      return false
    }
  }
}
export default Payment

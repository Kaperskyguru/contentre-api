import { prisma } from '@/config'
import { User } from '@/types/modules'
import { ApolloError } from 'apollo-server-errors'
import Paddle from './Paddle'
import Paystack from './Paystack'
import sendToSegment from '@extensions/segment-service/segment'
import { addDays } from 'date-fns'
import { environment } from '@/helpers/environment'

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
  switchToBasicDate?: Date
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

  async webhook(data: any) {
    const payment = await this.service.webhook(data)
    console.log(payment)
    if (payment) {
      switch (payment.status.toLowerCase()) {
        case 'subscription_payment_succeeded':
          // Create new Subscription
          // SEND ACTIVATION MAIL
          return await this.subscriptionSuccessful(payment)

        case 'subscription_cancelled':
          // Add a time to revert to free account
          break

        case 'payment_refunded':
          // Update subscription to old Expiry date
          break

        case 'subscription_payment_failed':
          // Do nothing, alert user
          // SEND FAILED MAIL
          return await this.subscriptionFailed(payment)

        case 'created':
          // SUCCESSFULLY CREATED A PENDING SUBSCRIPTION
          // SEND INVOICE NOTICE
          return await this.createPendingSubscription(payment)

        case 'success':
          // SUCCESSFULLY SUBSCRIBED FIRST TIME
          // SEND ACTIVATION MAIL
          return await this.subscriptionSuccessful(payment)

        case 'update':
          // SUCCESSFULLY RE-SUBSCRIBED
          // SEND RE-ACTIVATION MAIL
          return await this.createPendingSubscription(payment)
      }
    }

    return false
  }
  async subscriptionFailed(payment: any) {
    const user = await prisma.user.findFirst({
      where: { email: { equals: payment.customerEmail, mode: 'insensitive' } }
    })
    if (!user) return false
    await this.sendToSegment(user, 'user_subscription_failed', {
      planChannel: payment.metadata?.plan?.trim(),
      channel: payment.metadata?.channel,
      expiry: payment?.nextPaymentDate,
      price: payment.price,
      channelSubscriptionId: payment?.subscriptionId,
      message: `Subscription failed from ${payment.metadata?.channel}`
    })
    await this.createPendingSubscription(payment)
    return true
  }

  private async getOrCreateSubscription(
    user: User,
    payment: any
  ): Promise<Sub> {
    const planChannel = await prisma.paymentChannel.findFirst({
      where: {
        paymentPlanId: payment.metadata?.plan?.trim(),
        channel: payment.metadata?.channel
      },
      include: { plan: true }
    })

    if (!planChannel) {
      await this.sendToSegment(user, 'user_subscription_failed', {
        planChannel: payment.metadata?.plan?.trim(),
        channel: payment.metadata?.channel,
        expiry: payment.nextPaymentDate,
        price: payment.price,
        paddleSubscriptionId: payment.subscriptionId,
        message: 'Plan channel not found'
      })

      return {
        error: true
      }
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
      switchToBasicDate: subscription?.switchToBasicDate ?? undefined,
      error: false
    }
  }

  private async subscriptionSuccessful(payment: any) {
    try {
      const user = await prisma.user.findFirst({
        where: { email: { equals: payment.customerEmail, mode: 'insensitive' } }
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
          expiry: payment.nextPaymentDate,
          switchToBasicDate: null,
          channel: payment.metadata?.channel
        }
      })

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isPremium: true
        }
      })

      // Send to Segment
      await this.sendToSegment(user, 'user_subscribed', {
        planName: subscription?.name!,
        channel: payment.metadata?.channel,
        expiry: payment.nextPaymentDate,
        price: payment.price,
        channelSubscriptionId: payment.subscriptionId
      })
      return true
    } catch (error) {
      console.log(error, 'error')
      return false
    }
  }

  private async createPendingSubscription(data: any) {
    const user = await prisma.user.findFirst({
      where: { email: { equals: data.customerEmail, mode: 'insensitive' } }
    })

    if (!user) return false

    const subscription = await this.getOrCreateSubscription(user, data)

    if (subscription.error) return false

    const record: Record<string, unknown> = {}
    if (subscription.switchToBasicDate === undefined) {
      record.switchToBasicDate = addDays(new Date(), environment.grace_period)
    }

    await prisma.subscription.update({
      where: { id: subscription?.id! },
      data: {
        ...record,
        expiry: data?.nextPaymentDate
      }

      // Add a Date field to indicate the final date to switch to Basic Plan (plan !== null && switchToBasicDate <= now() = kill(set planID, channelID to null))
      // Also, create a field in each premium feature to indicate what to delete when finally switching to Basic
    })
  }

  private async sendToSegment(user: User, eventName: string, data: any) {
    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        ...user
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName,
      userId: user.id,
      data: {
        ...data,
        ...user
      }
    })
  }
}
export default Payment

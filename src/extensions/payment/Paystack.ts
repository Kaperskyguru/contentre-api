import { ApolloError } from 'apollo-server-errors'
import Service from './service'
import crypto from 'crypto'
import express from 'express'
import { environment } from '@/helpers/environment'

interface Subscription {
  amount: string
  plan_id: string
  email: string
}

class Paystack {
  service: any
  constructor(paymentService: String) {
    this.service = Service({ service: paymentService })
  }

  async webhook(req: express.Request) {
    try {
      if (this.validateWebhook(req)) {
        const response = req.body

        switch (response.event) {
          case 'subscription.create':
            return this.subscriptionCreated(response.data)

          case 'charge.success':
            if (
              response.data.status === 'success' &&
              (await this.verifyPayment(response.data.reference))
            )
              return this.chargeSuccessful(response.data)

          case 'invoice.update':
            if (
              response.data.paid &&
              response.data.status === 'success' &&
              response.data.transaction.status === 'success'
            )
              return this.invoiceUpdated(response.data)

          case 'invoice.create':
            // Invoice has been created for new payment. You might want to also inform the user
            return this.invoiceCreated(response.data)

          case 'invoice.payment_failed':
            return this.failedPayment(response.data)

          case 'subscription.not_renew':
            // Subscription will not be renewing. Inform the user. After Grace Period, move to Basic
            break

          case 'subscription.disable':
            // Inform the user and change account to basic
            break

          case 'subscription.expiring_cards':
            // Inform users of expired cards for next billing
            break
          default:
            break
        }
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  private validateWebhook(req: express.Request) {
    const hash = crypto
      .createHmac('sha512', environment.paystack.token)
      .update(JSON.stringify(req.body))
      .digest('hex')
    return hash == req.headers['x-paystack-signature']
  }

  private async verifyPayment(reference: string) {
    try {
      const res = await this.service.get(`/transaction/verify/${reference}`)
      if (res.status === 200 && res.data.status) {
        return true
      }
      return false
    } catch (errors) {
      console.log(errors)
      throw new ApolloError('Payment verification error')
    }
  }

  private async failedPayment(data: any) {
    return {
      status: 'subscription_payment_failed',
      customerEmail: data?.customer?.email,
      subscriptionId: data?.subscription?.id,
      price: data.amount,
      metadata: {
        planName: data?.plan?.name,
        planCode: data?.plan?.plan_code
      },
      nextPaymentDate: data?.subscription?.next_payment_date
    }
  }

  private async invoiceCreated(data: any) {
    return {
      status: 'created',
      customerEmail: data?.customer?.email,
      subscriptionId: data?.subscription?.id,
      price: data.amount,
      metadata: {
        channel: 'PAYSTACK',
        plan: data?.plan?.plan_code
      },
      nextPaymentDate: data?.subscription?.next_payment_date
    }
  }

  private async invoiceUpdated(data: any) {
    return {
      status: 'update',
      customerEmail: data?.customer?.email,
      subscriptionId: data?.subscription?.id,
      price: data.amount,
      metadata: {
        channel: 'PAYSTACK',
        plan: data?.plan?.plan_code
      },
      nextPaymentDate: data?.subscription?.next_payment_date
    }
  }

  private async chargeSuccessful(data: any) {
    return {
      status: 'success',
      customerEmail: data?.customer?.email,
      subscriptionId: '',
      price: data.amount,
      metadata: data.metadata
    }
  }

  private async subscriptionCreated(data: any) {
    return {
      status: 'created',
      customerEmail: data?.customer?.email,
      subscriptionId: data?.id,
      price: data.amount,
      metadata: {
        channel: 'PAYSTACK',
        plan: data?.plan?.plan_code
      },
      nextPaymentDate: data?.next_payment_date
    }
  }
}

export default Paystack

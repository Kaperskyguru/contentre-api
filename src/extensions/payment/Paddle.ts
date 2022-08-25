import { format } from 'date-fns'
import Service from './service'

class Paddle {
  Paddle: any
  constructor(paymentService: String) {
    this.Paddle = Service({ service: paymentService })
  }

  async webhook(data: any) {
    try {
      console.log(data, 'Paddle hook')
      const event = await this.Paddle.parseWebhookEvent(data)
      console.log(event)

      // switch (event.eventType.toLowerCase()) {
      //   case 'payment_succeeded':
      //     this.processPaymentSucceeded(data)
      //     break
      //   case 'payment_refunded':
      //     this.processPaymentRefunded(data)
      //     break
      //   case 'subscription_created':
      //     this.processSubscriptionCreated(data)
      //     break
      //   case 'subscription_updated':
      //     this.processSubscriptionUpdated(data)
      //     break
      //   case 'subscription_cancelled':
      //     this.processSubscriptionCancelled(data)
      //     break
      //   case 'subscription_payment_succeeded':
      //     this.processSubscriptionPaymentSucceeded(data)
      //     break
      // }
      return this.processPayment(event)
    } catch (error) {
      if (
        error.message.includes('Implementation missing:') &&
        data.alert_name === 'subscription_payment_failed'
      ) {
        this.processSubscriptionPaymentFailed(data)
        return true
      }
      return false
    }
  }

  private processPayment(data: any) {
    return {
      status: data.eventType,
      customerEmail: data.customerEmail,
      subscriptionId: data.subscriptionId,
      price: data.price,
      nextPaymentDate: format(data.nextPaymentDate, 'MM/dd/yyyy')
    }
  }

  processSubscriptionPaymentFailed(data: any) {
    return {
      status: data.alert_name,
      customerEmail: data.email,
      subscriptionId: data.subscription_id,
      price: parseFloat(data.price),
      nextPaymentDate: data.next_bill_date
    }
  }
  // processSubscriptionPaymentSucceeded(data: any) {
  //   throw new Error('Method not implemented.')
  // }
  // processSubscriptionCancelled(data: any) {
  //   throw new Error('Method not implemented.')
  // }
  // processSubscriptionUpdated(data: any) {
  //   throw new Error('Method not implemented.')
  // }
  // processSubscriptionCreated(data: any) {
  //   throw new Error('Method not implemented.')
  // }
  // processPaymentRefunded(data: any) {
  //   throw new Error('Method not implemented.')
  // }
  // processPaymentSucceeded(data: any) {
  //   throw new Error('Method not implemented.')
  // }

  // STATUS = {
  //   PAYMENT_SUCCEEDED: 'PAYMENT_SUCCEEDED',
  //   PAYMENT_REFUNDED: 'PAYMENT_REFUNDED',
  //   SUBSCRIPTION_CREATED: 'SUBSCRIPTION_CREATED',
  //   SUBSCRIPTION_UPDATED: 'SUBSCRIPTION_UPDATED',
  //   SUBSCRIPTION_CANCELLED: 'SUBSCRIPTION_CANCELLED',
  //   SUBSCRIPTION_PAYMENT_SUCCEEDED: 'SUBSCRIPTION_PAYMENT_SUCCEEDED'
  // }
}

export default Paddle

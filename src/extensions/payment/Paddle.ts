import Service from './service'

class Paddle {
  Paddle: any
  constructor(paymentService: String) {
    this.Paddle = Service({ service: paymentService })
  }

  async webhook(data: any) {
    try {
      //TODO: Check for duplicate subscription with SubscriptionID from the event variable

      const event = this.processPayment(
        await this.Paddle.parseWebhookEvent(data)
      )

      // if (event) {
      //   switch (event.status.toLowerCase()) {
      //     case 'subscription_payment_succeeded':
      //       // Create new Subscription
      //       return event.event = "subscription_payment_succeeded"

      //     case 'subscription_cancelled':
      //       // Add a time to revert to free account
      //       break

      //     case 'payment_refunded':
      //       // Update subscription to old Expiry date
      //       break

      //     case 'subscription_payment_failed':
      //       // Do nothing, alert user
      //       return event.event = "subscription_payment_failed"
      //       // return await this.subscriptionFailed(event)

      //     case 'subscription_updated':
      //       // Update new Expiring date, check type for upgrade or downgrade
      //       break
      //   }
      // }

      return event
    } catch (error) {
      console.log(error, 'error_PADDLE')
      if (
        error.message.includes('Implementation missing:') &&
        data.alert_name === 'subscription_payment_failed'
      ) {
        return this.processSubscriptionPaymentFailed(data)
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
      metadata: data.metadata,
      nextPaymentDate: data.nextPaymentDate
    }
  }

  processSubscriptionPaymentFailed(data: any) {
    return {
      status: data.alert_name,
      customerEmail: data.email,
      subscriptionId: data.subscription_id,
      metadata: JSON.parse(data.passthrough),
      price: parseFloat(data.price),
      nextPaymentDate: data.next_bill_date
    }
  }
}

export default Paddle

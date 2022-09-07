import Service from './service'

class Paddle {
  Paddle: any
  constructor(paymentService: String) {
    this.Paddle = Service({ service: paymentService })
  }

  async webhook(data: any) {
    try {
      return this.processPayment(await this.Paddle.parseWebhookEvent(data))
    } catch (error) {
      if (
        error.message.includes('Implementation missing:') &&
        data.alert_name === 'subscription_payment_failed'
      ) {
        return this.processSubscriptionPaymentFailed(data)
      }
      console.log(error)
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

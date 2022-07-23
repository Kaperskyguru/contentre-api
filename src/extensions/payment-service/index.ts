import { ApolloError } from 'apollo-server-errors'
import Paystack from './Paystack'

interface Subscription {
  amount: string
  plan_id: string
  email: string
}

class Payment {
  service: any
  constructor(paymentService: String) {
    switch (paymentService) {
      case 'PAYSTACK':
        this.service = new Paystack(paymentService)
        break
      default:
        break
    }
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
}
export default Payment

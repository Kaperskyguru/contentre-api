import { ApolloError } from 'apollo-server-errors'
import Service from './service'

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

  async getPlan(id: string) {
    try {
      const res = await this.service.get(`/plan/${id}`)
      console.log(res)
    } catch (errors) {
      console.log(errors)
      throw new ApolloError('Plan failed error')
    }
  }

  async subscribe(data: Subscription) {
    try {
      const params = JSON.stringify({
        email: data.email,
        amount: data.amount,
        plan: data.plan_id
      })
      const res = await this.service.post(`/transaction/initialize`, params)
      if (res.status === 200) {
        return res.data
      }
    } catch (errors) {
      console.log(errors)
      throw new ApolloError('Payment subscription error')
    }
  }

  async cancel() {}
}

export default Paystack

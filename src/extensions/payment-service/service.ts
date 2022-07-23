import { environment } from '@/helpers/environment'
import Axios from 'axios'

export default ({ service }: any) => {
  switch (service) {
    case 'PAYSTACK':
      return PaystackConfig()
      break

    case 'PADDLE':
      return PaddleConfig()
      break

    default:
      break
  }
}

const PaystackConfig = () => {
  const axios = Axios.create({
    baseURL: environment.paystack.url ?? 'https://api.medium.com/v1',
    headers: {
      Authorization: `Bearer ${environment.paystack.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Charset': 'utf-8'
    }
  })

  return axios
}

const PaddleConfig = () => {
  const axios = Axios.create({
    baseURL: environment.paystack.url ?? 'https://api.medium.com/v1',
    headers: {
      Authorization: `Bearer ${environment.paystack.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Charset': 'utf-8'
    }
  })

  return axios
}

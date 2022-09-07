import { environment } from '@/helpers/environment'
import Axios from 'axios'
import { PaddleSdk, stringifyMetadata } from '@devoxa/paddle-sdk'

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
    baseURL: environment.paystack.url ?? '',
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
  console.log(environment.paddle.publicKey)
  return new PaddleSdk<{}>({
    publicKey: environment.paddle.publicKey ?? '',
    vendorId: environment.paddle.vendorId,
    vendorAuthCode: environment.paddle.vendorAuthCode,
    metadataCodec: stringifyMetadata()
  })
}

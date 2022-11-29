import { environment } from '@/helpers/environment'
import axios from 'axios'

export const previsionCustomDomain = async (domain: string) => {
  const token = environment.cloudflare.token
  const zoneId = environment.cloudflare.zoneId

  const endpoint = `https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  const body = {
    hostname: domain,
    ssl: {
      method: 'http',
      type: 'dv',
      settings: {
        http2: 'on',
        min_tls_version: '1.2',
        tls_1_3: 'on',
        ciphers: ['ECDHE-RSA-AES128-GCM-SHA256', 'AES128-SHA'],
        early_hints: 'on'
      },
      bundle_method: 'ubiquitous',
      wildcard: false
    }
  }

  try {
    const response = await axios({
      url: endpoint,
      method: 'POST',
      data: JSON.stringify(body),
      headers: {
        ...headers
      }
    })

    const { data } = response
    return data
  } catch (error) {
    throw new Error(error && error?.response ? error.response.data : error)
  }
}

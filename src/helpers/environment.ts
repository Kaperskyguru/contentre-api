const defaultPort = 9000

export interface Environment {
  context: 'LOCAL' | 'DEVELOP' | 'STAGING' | 'PRODUCTION'
  apiURL: string
  appName: string
  domain: string
  port: number | string
  debug?: string
  apollo: {
    introspection: boolean
    playground: boolean
  }
  mailchimp: {
    key: string
    server: string
    id: string
  }
  medium: {
    BASE_URL: string
  }
  paystack: {
    url: string
    token: string
  }
  paddle: {
    publicKey: string
    vendorId: number
    vendorAuthCode: string
  }
  database: {
    url: string
  }
  auth: {
    saltRounds: number
    tokenSecret: string
  }
  mailjet: {
    apiKey: string
    apiSecret: string
  }
  mail: {
    host: string
    port: number
    username: string
    password: string
    sender: string
  } | null
  sentry: {
    dsn: string
  }
  google: {
    projectId: string
    clientEmail: string
    privateKey: string
    bucketName: string
    bucketNameTemporary: string
    asyncFunction: string
    taskQueue: string
    taskQueueHandler: string
    taskQueueLocation: string
    oauthGoogleClientToken: string
  }
  adminToken?: string
  segment: string
  pusher: {
    appId: string
    key: string
    secret: string
    cluster: string
  }
}

const context =
  (process.env.CONTEXT as
    | 'LOCAL'
    | 'DEVELOP'
    | 'STAGING'
    | 'PRODUCTION'
    | undefined) || 'LOCAL'

export const environment: Environment = {
  context,
  port: process.env.PORT || defaultPort,
  apiURL: process.env.API_URL as string,
  appName: process.env.APP_NAME as string,
  domain: process.env.FE_URL as string,
  debug: process.env.DEBUG,
  apollo: {
    introspection: ['LOCAL', 'DEVELOP'].includes(context),
    playground: ['LOCAL', 'DEVELOP'].includes(context)
  },
  mailchimp: {
    key: process.env.MAILCHIMP_KEY as string,
    server: process.env.MAILCHIMP_SERVER as string,
    id: process.env.MAILCHIMP_LIST_ID as string
  },
  paystack: {
    url: process.env.PAYSTACK_BASE_URL as string,
    token: process.env.PAYSTACK_TOKEN as string
  },
  paddle: {
    publicKey: `-----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAnP2cCMNoH92dnfot213X
    SR9hUTsIT5U9Y/HcCqe1KvHWgRIIIFljtVx8QCE24hpmnTh6qoJm0T6tw4B28VY5
    AcKL2Mwr6hr0Axj6xItoqV9iy0H21B8QcTYUcqcDek1G7+gUUFdYSop7r6JRiZsd
    Y5LgKseHcl684N6xNOElrTAUBtrK4Lawkhmz3C93YTl1dO6Vnm2QJgAWed81v4wl
    SeKhYZSJRrpq1B59ZjAdGe6FRTVzsT6FNxClW30r1NmxllY0mkYD17RRXc4mvkUp
    VOWqNjyX+h9bYUng3Sa/icqrUTqOuErvHxcRed14dXyia9M+lKEBE3OAyD18zzqL
    LCqY7AqAjGr0OqM4/wd+9WUipC3UVj/b2lLJnpf4j4/ANo9Tez+0GTGx9jB8lEJY
    A/Z8JNIP529+FOHb+uNJow71pThpV01f3dj5fQFRKHlsWlaPCI6NOhCsKDIk6DGX
    5kOPLyV6v/6lXwddH546tLWuDvN7cmX1Mw7dGxEkjYSuw5oatUUKIUxJhekXwUoI
    RSVohCLG1MDAPjJIrkLr3KyYp9dLOszJII3GGPEc2RGNZ7DTaUQWyARtdqnc9/9I
    oweSVBKm9HahLI9ZkS4pEtqtEaKeajXbR4lEItQQYeGvD6egUfK9OrSmszLGPZvR
    N0f6I3SyxlkY+sPbZlYqgE0CAwEAAQ==
-----END PUBLIC KEY-----`,
    vendorId: Number(process.env.PADDLE_VENDOR_ID),
    vendorAuthCode: process.env.PADDLE_VENDOR_AUTH_CODE as string
  },
  medium: {
    BASE_URL: process.env.MEDIUM_BASE_URL as string
  },
  database: {
    url: process.env.DATABASE_URL as string
  },
  auth: {
    saltRounds: Number(process.env.AUTH_SALT_ROUNDS) || 10,
    tokenSecret: process.env.AUTH_TOKEN_SECRET as string
  },
  mailjet: {
    apiKey: process.env.MAILJET_KEY as string,
    apiSecret: process.env.MAILJET_SECRET as string
  },
  mail: {
    host: process.env.MAIL_HOST as string,
    port: Number(process.env.MAIL_PORT) || 2525,
    username: process.env.MAIL_USERNAME as string,
    password: process.env.MAIL_PASSWORD as string,
    sender: process.env.MAIL_SENDER as string
  },
  sentry: {
    dsn: process.env.SENTRY_DSN as string
  },
  google: {
    projectId: process.env.GCP_PROJECT_ID!,
    clientEmail: process.env.GCP_CLIENT_EMAIL!,
    privateKey: process.env.GCP_PRIVATE_KEY!,
    bucketName: process.env.GCP_BUCKET!,
    bucketNameTemporary: process.env.GCP_BUCKET_TEMPORARY!,
    asyncFunction: process.env.GCP_ASYNC_FUNCTION!,
    taskQueue: process.env.GCP_ASYNC_TASK_QUEUE!,
    taskQueueHandler: process.env.GCP_ASYNC_TASK_QUEUE_HANDLER!,
    taskQueueLocation: process.env.GCP_ASYNC_TASK_QUEUE_LOCATION!,
    oauthGoogleClientToken: process.env.OAUTH_GOOGLE_CLIENT_TOKEN!
  },
  adminToken: process.env.ADMIN_TOKEN,
  segment: process.env.SEGMENT_KEY as string,
  pusher: {
    appId: process.env.PUSHER_APPID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!
  }
}

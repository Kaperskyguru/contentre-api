const defaultPort = 9000

export interface Environment {
  context: 'LOCAL' | 'DEVELOP' | 'STAGING' | 'PRODUCTION'
  apiURL: string
  appName: string
  domain: string
  port: number | string
  grace_period: number
  debug?: string
  apollo: {
    introspection: boolean
    playground: boolean
  }
  umami: {
    token: string
    baseURL: string
  }
  mailchimp: {
    key: string
    server: string
    id: string
  }
  medium: {
    BASE_URL: string
  }
  hashnode: {
    BASE_URL: string
  }
  devto: {
    BASE_URL: string
  }
  paystack: {
    url: string
    token: string
  }
  cloudflare: {
    token: string
    zoneId: string
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
  openai: {
    apiKey: string
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
  grace_period: Number(process.env.GRACE_PERIOD),
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
  cloudflare: {
    token: process.env.CLOUDFLARE_TOKEN as string,
    zoneId: process.env.CLOUDFLARE_CONTENTRE_ZONE_ID as string
  },
  paystack: {
    url: process.env.PAYSTACK_BASE_URL as string,
    token: process.env.PAYSTACK_TOKEN as string
  },
  paddle: {
    publicKey: process.env.PADDLE_PUBLIC_KEY as string,
    vendorId: Number(process.env.PADDLE_VENDOR_ID),
    vendorAuthCode: process.env.PADDLE_VENDOR_AUTH_CODE as string
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY as string
  },
  medium: {
    BASE_URL: process.env.MEDIUM_BASE_URL as string
  },
  hashnode: {
    BASE_URL: process.env.HASHNODE_BASE_URL as string
  },
  devto: {
    BASE_URL: process.env.DEVTO_BASE_URL as string
  },
  database: {
    url: process.env.DATABASE_URL as string
  },
  umami: {
    token: process.env.UMAMI_TOKEN as string,
    baseURL: process.env.UMAMI_BASE_URL as string
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

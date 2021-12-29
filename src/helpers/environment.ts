const defaultPort = 9000

export interface Environment {
  context: 'LOCAL' | 'DEVELOP' | 'STAGING' | 'PRODUCTION'
  apiURL: string
  port: number | string
  debug?: string
  apollo: {
    introspection: boolean
    playground: boolean
  }
  database: {
    url: string
  }
  auth: {
    saltRounds: number
    tokenSecret: string
  }
  yapily: {
    url: string
    key: string
    secret: string
  }
  veryfi: {
    clientId: string
    clientSecret: string
    username: string
    apiKey: string
  }
  mail: {
    host: string
    port: number
    username: string
    password: string
  } | null
  twilio: {
    sid: string
    token: string
    phone: string
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
  heronData: {
    username: string
    password: string
    url: string
    signature: string
  }
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
  debug: process.env.DEBUG,
  apollo: {
    introspection: ['LOCAL', 'DEVELOP'].includes(context),
    playground: ['LOCAL', 'DEVELOP'].includes(context)
  },
  database: {
    url: process.env.DATABASE_URL as string
  },
  auth: {
    saltRounds: Number(process.env.AUTH_SALT_ROUNDS) || 10,
    tokenSecret: process.env.AUTH_TOKEN_SECRET as string
  },
  yapily: {
    url: process.env.YAPILY_BASE_URL as string,
    key: process.env.YAPILY_APPLICATION_KEY as string,
    secret: process.env.YAPILY_APPLICATION_SECRET as string
  },
  veryfi: {
    clientId: process.env.VERYFI_CLIENT_ID as string,
    clientSecret: process.env.VERYFI_CLIENT_SECRET as string,
    username: process.env.VERYFI_USERNAME as string,
    apiKey: process.env.VERYFI_API_KEY as string
  },
  mail:
    process.env.MAIL_HOST || process.env.MAIL_PORT
      ? {
          host: process.env.MAIL_HOST as string,
          port: Number(process.env.MAIL_PORT) || 2525,
          username: process.env.MAIL_USERNAME as string,
          password: process.env.MAIL_PASSWORD as string
        }
      : null,
  twilio: process.env.TWILIO_ACCOUNT_SID
    ? {
        sid: process.env.TWILIO_ACCOUNT_SID as string,
        token: process.env.TWILIO_AUTH_TOKEN as string,
        phone: process.env.TWILIO_PHONE_NUMBER as string
      }
    : null,
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
  heronData: {
    username: process.env.HERON_DATA_USERNAME as string,
    password: process.env.HERON_DATA_PASSWORD as string,
    url: process.env.HERON_DATA_BASE_URL as string,
    signature: process.env.HERON_DATA_SIGNATURE as string
  },
  pusher: {
    appId: process.env.PUSHER_APPID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!
  }
}

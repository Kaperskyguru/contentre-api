import { PrismaClient } from '@prisma/client'
// import Pusher from 'pusher'
import { environment } from '@helpers/environment'

// export const pusher = new Pusher({
//   appId: environment.pusher.appId,
//   key: environment.pusher.key,
//   secret: environment.pusher.secret,
//   cluster: environment.pusher.cluster,
//   useTLS: true
// })

export const prisma = new PrismaClient({
  log:
    !!environment.debug &&
    (environment.debug === '"*"' ||
      environment.debug.includes('prisma:*') ||
      environment.debug.includes('prisma:query'))
      ? ['query']
      : undefined
})

export default { prisma } //pusher }

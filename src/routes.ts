import Payment from '@extensions/payment'
import { environment } from '@helpers/environment'
import cors from 'cors'
import express from 'express'
import sendUserUpdateProfile from './extensions/cron-tasks/send-update-profile'
import sendAddContent from '@extensions/cron-tasks/send-add-content'
import sendAnalytics from '@extensions/cron-tasks/send-analytics'
import { prisma } from './config'
import sendToSegment from '@/extensions/segment-service/segment'
import { login } from '@extensions/umami'
import createUmamiAccounts from '@extensions/cron-tasks/create-umami-accounts'

export const app = express()

const origins: Readonly<{
  [key: string]: (string | RegExp)[] | RegExp | boolean
}> = Object.freeze({
  LOCAL: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://hoppscotch.io',
    'https://bd3a-197-210-70-147.ngrok.io',
    /\.contentre.io\.local$/
  ],
  DEVELOP: [
    /\.contentre\.io$/,
    /https:\/\/deploy-preview-.*--contentre-app\.netlify\.app$/,
    /https:\/\/deploy-preview-.*--develop-app-contentre\.netlify\.app$/
  ],
  STAGING: [
    'http://localhost:3000',
    'https://hoppscotch.io',
    /https:\/\/staging.contentre\.io$/,
    /https:\/\/v2.contentre\.io$/
  ], // remove *
  PRODUCTION: true //['*', /\.*contentre\.io$/, /\.contentre\.io$/]
})

const corsOptions = cors({
  origin: origins[environment.context],
  credentials: true
})

app.use(corsOptions)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

// Create REST API here to communicate with GraphQL
app.get('/cronjob/profile-update', async (req, res) => {
  await sendUserUpdateProfile()
  res.status(200).end(`messages sent`)
})

app.get('/cronjob/analytics', async (req, res) => {
  await sendAnalytics()
  res.status(200).end(`messages sent`)
})

app.get('/umami/portfolio-analytics', async (req, res) => {
  await createUmamiAccounts()
  res.status(200).end(`portfolio analytics updated`)
})

//user => 'dc2540f3-38e3-4742-8a08-55a22bc7bb53'
app.post('/umami/login', async (req, res) => {
  const data = await login(req)
  res.status(200).json(data)
})

// TODO: Send users actionable tasks to do to complete onboarding

app.get('/cronjob/test', async (req, res) => {
  const users = await prisma.user.findMany({})

  try {
    // await Promise.all(
    //   users.map(async (user) => {
    //     console.log(user.hasFinishedOnboarding)
    //     const segmentData = {
    //       email: user.email,
    //       username: user.username,
    //       portfolio: user.portfolioURL
    //     }

    //     await sendToSegment({
    //       operation: 'identify',
    //       userId: user.id,
    //       data: segmentData
    //     })

    //     await sendToSegment({
    //       operation: 'track',
    //       eventName: 'has_completed_onboarding',
    //       userId: user.id,
    //       data: {
    //         ...segmentData,
    //         hasCompletedOnboarding: user.hasFinishedOnboarding,
    //         name: user.name,
    //         email: user.email
    //       }
    //     })
    //   })
    // )

    console.log(users.length)

    res.status(200).json(users)
  } catch (error) {
    res.status(500).end(`error`)
  }
})

app.get('/cronjob/add-content', async (req, res) => {
  await sendAddContent()
  res.status(200).end(`messages sent`)
})

app.post(
  '/subscription/paddle/webhook',
  async (req: express.Request, res: express.Response) => {
    const payment = new Payment('PADDLE')
    await payment.webhook(req.body)
    res.status(200).end()
  }
)

app.post(
  '/subscription/paystack/webhook',
  async (req: express.Request, res: express.Response) => {
    const payment = new Payment('PAYSTACK')
    await payment.webhook(req)
    res.sendStatus(200)
  }
)

export default { app }

import Payment from '@extensions/payment'
import { environment } from '@helpers/environment'
import cors from 'cors'
import express from 'express'
import sendUserUpdateProfile from './extensions/cron-tasks/send-update-profile'
import sendAddContent from '@extensions/cron-tasks/send-add-content'
import sendAnalytics from '@extensions/cron-tasks/send-analytics'
import { prisma } from './config'
import sendToSegment from '@/extensions/segment-service/segment'

export const app = express()

const origins: Readonly<{
  [key: string]: (string | RegExp)[] | RegExp | string
}> = Object.freeze({
  LOCAL: [
    'http://localhost:3000',
    'https://bd3a-197-210-70-147.ngrok.io',
    /\.contentre.io\.local$/
  ],
  DEVELOP: [
    /\.contentre\.io$/,
    /https:\/\/deploy-preview-.*--contentre-app\.netlify\.app$/,
    /https:\/\/deploy-preview-.*--develop-app-contentre\.netlify\.app$/
  ],
  STAGING: ['http://localhost:3000', /https:\/\/staging.contentre\.io$/], // remove *
  PRODUCTION: '*' //['*', /\.*contentre\.io$/, /\.contentre\.io$/]
})

const corsOptions = cors({
  origin: origins[environment.context]
  // credentials: environment.context === 'PRODUCTION' ? false : true
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

// TODO: Send users actionable tasks to do to complete onboarding

app.post('/cronjob/test', async (req, res) => {
  const users = await prisma.user.findMany({})

  try {
    await Promise.all(
      users.map(async (user) => {
        console.log(user.hasFinishedOnboarding)
        const segmentData = {
          email: user.email,
          username: user.username,
          portfolio: user.portfolioURL
        }

        await sendToSegment({
          operation: 'identify',
          userId: user.id,
          data: segmentData
        })

        await sendToSegment({
          operation: 'track',
          eventName: 'has_completed_onboarding',
          userId: user.id,
          data: {
            ...segmentData,
            hasCompletedOnboarding: user.hasFinishedOnboarding,
            name: user.name,
            email: user.email
          }
        })
      })
    )

    res.status(200).end(` messages sent`)
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

import Payment from '@extensions/payment'
import { environment } from '@helpers/environment'
import cors from 'cors'
import express from 'express'
import sendUserUpdateProfile from './extensions/cron-tasks/send-update-profile'
import sendAddContent from '@extensions/cron-tasks/send-add-content'
import sendAnalytics from '@extensions/cron-tasks/send-analytics'

export const app = express()

const origins: Readonly<{
  [key: string]: (string | RegExp)[] | RegExp
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
  PRODUCTION: /\.*contentre\.io$/
})

const corsOptions = cors({
  origin: '*', //origins[environment.context],
  credentials: true
})

app.use(corsOptions)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

// Create REST API here to communicate with GraphQL
app.post('/cronjob/profile-update', async (req, res) => {
  const totalSent = await sendUserUpdateProfile()
  res.status(200).end(`${totalSent} messages sent`)
})

app.post('/cronjob/analytics', async (req, res) => {
  const totalSent = await sendAnalytics()
  res.status(200).end(`${totalSent} messages sent`)
})

app.post('/cronjob/add-content', async (req, res) => {
  const totalSent = await sendAddContent()
  res.status(200).end(`${totalSent} messages sent`)
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

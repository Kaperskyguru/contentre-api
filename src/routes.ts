import Payment from '@extensions/payment'
import { environment } from '@helpers/environment'
import cors from 'cors'
import express from 'express'
// import automateUserEmail from './rest/automate-user-email'

export const app = express()

const origins: Readonly<{
  [key: string]: (string | RegExp)[] | RegExp
}> = Object.freeze({
  LOCAL: ['http://localhost:3000', /\.contentre.io\.local$/],
  DEVELOP: [
    /\.contentre\.io$/,
    /https:\/\/deploy-preview-.*--contentre-app\.netlify\.app$/,
    /https:\/\/deploy-preview-.*--develop-app-contentre\.netlify\.app$/
  ],
  STAGING: ['http://localhost:3000', /https:\/\/staging.contentre\.io$/], // remove *
  PRODUCTION: /\.*contentre\.io$/
})

const corsOptions = cors({
  origin: origins[environment.context],
  credentials: true
})

app.use(corsOptions)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))

// Create REST API here to communicate with GraphQL
// app.post('/sendOnboardingMail', (req, res) => {
//   automateUserEmail()
//   res.end('API under development')
// })

app.post(
  '/subscription/paddle/webhook',
  async (req: express.Request, res: express.Response) => {
    const payment = new Payment('PADDLE', 'Premium')
    const isSuccessful = await payment.webhook(req.body)

    if (isSuccessful) res.status(200).end()
    res.sendStatus(403)
  }
)

export default { app }

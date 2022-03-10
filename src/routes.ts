import { environment } from '@helpers/environment'
import cors from 'cors'
import express from 'express'

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
  STAGING: ['http://localhost:3000', /\.contentre\.io$/],
  PRODUCTION: /app\.contentre\.io$/
})

const corsOptions = cors({
  origin: origins[environment.context],
  credentials: true
})

app.use(corsOptions)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

export default { app }

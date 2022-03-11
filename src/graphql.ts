import { ApolloServer } from 'apollo-server-express'
import httpHeadersPlugin from 'apollo-server-plugin-http-headers'
import express from 'express'
import { environment } from '@helpers/environment'
import schema from '@modules'
import { GraphQLError } from 'graphql'
import { lookup } from 'fast-geoip'
import { app } from '@/routes'
import { Context } from '@types'
import '@helpers/clearIndentation'
import { prisma } from '@/config'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled
} from 'apollo-server-core'
import { getUserByToken } from './helpers/getUser'

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    introspection: ['LOCAL', 'DEVELOP'].includes(environment.context),
    plugins: [
      httpHeadersPlugin,
      ['LOCAL', 'DEVELOP'].includes(environment.context)
        ? ApolloServerPluginLandingPageGraphQLPlayground({})
        : ApolloServerPluginLandingPageDisabled()
    ], // add error here later,

    formatError: (error) => {
      const sentryId = error.extensions?.sentryId

      // If we didn't attach `sentryId`, we know this is an expected error.
      if (!sentryId) return error

      // Detect if we ensured the error was handled.
      // const handled = !!(error?.extensions?.handled || false)

      // Define the tracing message based on the context.
      const tracingMessage = ['LOCAL', 'DEVELOP'].includes(environment.context)
        ? 'Note: Tracing ID unavailable in development.'
        : `Tracing ID: ${sentryId}.`

      let errorResponse: { message: string; debug?: GraphQLError } = {
        message: error.message
          ? error.message
          : `Something unexpected happened. ${tracingMessage}`
      }

      // Attach the whole error object for development environment.
      if (
        ['LOCAL', 'DEVELOP'].includes(environment.context) ||
        environment.context === 'STAGING'
      )
        errorResponse = {
          ...errorResponse,
          debug: error
        }

      return errorResponse
    },

    context: async ({ req }) => {
      const { headers } = req

      // Get auth token from cookies
      const token = headers.cookie?.split('token=')[1]
        ? headers.cookie.split('token=')[1].split(';')[0]
        : undefined
      // Get auth locale from cookies
      const locale = headers.cookie?.split('i18n_redirected=')[1]
        ? headers.cookie.split('i18n_redirected=')[1].split(';')[0]
        : 'en-GB'

      // For error tracking
      const sentryId =
        headers['x-transaction-id'] ||
        `${Math.random().toString(36).substr(2, 9)}`

      const parseRequestURL = (r: express.Request) => {
        const xFromPath = r.headers['x-from-path']

        if (!xFromPath || !xFromPath.length) {
          return req.get('Referrer') || req.get('Origin') || null
        }

        return (Array.isArray(xFromPath) ? xFromPath[0] : xFromPath) || null
      }

      const parseIpAddress = (r: express.Request) => {
        const xForwardedFor = r.headers['x-forwarded-for']

        if (xForwardedFor !== undefined) {
          return (
            (Array.isArray(xForwardedFor)
              ? xForwardedFor.shift()
              : xForwardedFor.split(',').shift()) ?? null
          )
        }

        return r.socket?.remoteAddress ?? null
      }

      const address = parseIpAddress(req)
      const geolocation = address ? await lookup(address) : null
      const ipAddress =
        address || geolocation
          ? {
              address,
              geolocation
            }
          : null

      return {
        setCookies: [],
        setHeaders: [],
        sentryId,
        // Try to retrieve a user with the token if any
        user: token ? await getUserByToken(token) : null,
        token,
        locale,
        prisma,
        ipAddress,
        requestURL: parseRequestURL(req),
        requestOrigin: req.get('Origin')
      } as Context
    }
  })

  await server.start()

  server.applyMiddleware({ app, cors: false })

  app.listen({ port: environment.port }, () => {
    console.log(`🚀 GraphQL API ready at port ${environment.port}...`)
  })

  return { server, app }
}

;(() => startApolloServer())()

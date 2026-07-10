import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { env } from '@/env'
import { errorHandler } from '@/http/error-handler'
import { leadsRoutes } from '@/http/leads/routes'

export const app = new Elysia()
  .use(
    cors({
      origin: ['http://localhost:3000', 'https://canteraapp.com'],
    }),
  )
  .use(openapi())
  .use(errorHandler)
  .use(leadsRoutes)
  .listen(env.PORT)

console.log(`Server running at http://localhost:${env.PORT}`)

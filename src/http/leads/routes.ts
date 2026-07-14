import { Elysia } from 'elysia'
import { createLeadRoute } from './create-lead'
import { listLeadsRoute } from './list-leads'

export const leadsRoutes = new Elysia({ prefix: '/leads' })
  .use(createLeadRoute)
  .use(listLeadsRoute)

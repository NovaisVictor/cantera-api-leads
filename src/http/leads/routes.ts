import { Elysia } from 'elysia'
import { createLeadRoute } from './create-lead'

export const leadsRoutes = new Elysia({ prefix: '/leads' }).use(createLeadRoute)

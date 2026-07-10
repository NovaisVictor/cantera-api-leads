import { Elysia } from 'elysia'
import z from 'zod'
import { db } from '@/database/client'
import { leads } from '@/database/schema/leads'

export const createLeadRoute = new Elysia().post(
  '/',
  async ({ body, status }) => {
    const [lead] = await db
      .insert(leads)
      .values({
        name: body.name,
        whatsapp: body.whatsapp,
        email: body.email,
        profile: body.profile,
        source: body.source,
        campaign: body.campaign,
        submittedAt: new Date(body.submittedAt),
      })
      .returning({ id: leads.id })

    return status(201, { leadId: lead.id })
  },
  {
    detail: {
      summary: 'Receber e armazenar um lead',
      tags: ['Leads'],
    },
    body: z.object({
      name: z.string().min(1),
      whatsapp: z.string().min(1),
      email: z.email(),
      profile: z.string().min(1),
      source: z.string().min(1),
      campaign: z.string().min(1),
      submittedAt: z.iso.datetime(),
    }),
    response: {
      201: z.object({ leadId: z.string() }),
      400: z.object({ message: z.string(), field: z.string().optional() }),
      409: z.object({ message: z.string() }),
    },
  },
)

import type { InferSelectModel } from 'drizzle-orm'
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const leads = pgTable(
  'leads',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => Bun.randomUUIDv7()),
    name: text('name').notNull(),
    whatsapp: text('whatsapp').notNull(),
    email: text('email').notNull().unique(),
    profile: text('profile').notNull(),
    source: text('source').notNull(),
    campaign: text('campaign').notNull(),
    submittedAt: timestamp('submitted_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('leads_campaign_idx').on(table.campaign),
    index('leads_source_idx').on(table.source),
  ],
)

export type Lead = InferSelectModel<typeof leads>

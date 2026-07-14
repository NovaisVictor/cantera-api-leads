import { desc } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '@/database/client'
import type { Lead } from '@/database/schema/leads'
import { leads } from '@/database/schema/leads'
import { basicAuth } from '@/http/plugins/basic-auth'

const LEADS_PAGE_LIMIT = 100

export const listLeadsRoute = new Elysia().use(basicAuth).get(
  '/',
  async ({ set }) => {
    const rows = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(LEADS_PAGE_LIMIT)

    set.headers['Content-Type'] = 'text/html; charset=utf-8'
    return renderLeadsPage(rows)
  },
  {
    basicAuth: true,
    detail: {
      summary: 'Página HTML com os leads capturados (protegida por Basic Auth)',
      tags: ['Leads'],
    },
  },
)

function renderLeadsPage(rows: Lead[]): string {
  const tableRows = rows
    .map(
      (lead) => `
        <tr>
          <td>${escapeHtml(lead.name)}</td>
          <td>${escapeHtml(lead.whatsapp)}</td>
          <td>${escapeHtml(lead.email)}</td>
          <td>${escapeHtml(lead.profile)}</td>
          <td>${escapeHtml(lead.source)}</td>
          <td>${escapeHtml(lead.campaign)}</td>
          <td>${lead.submittedAt.toISOString()}</td>
          <td>${lead.createdAt.toISOString()}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Leads — Cantera</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 14px; text-align: left; }
    th { background: #f4f4f4; }
  </style>
</head>
<body>
  <h1>Leads capturados (${rows.length})</h1>
  <table>
    <thead>
      <tr><th>Nome</th><th>WhatsApp</th><th>Email</th><th>Perfil</th><th>Origem</th><th>Campanha</th><th>Enviado em</th><th>Criado em</th></tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

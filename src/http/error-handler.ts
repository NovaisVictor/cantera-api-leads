import { Elysia } from 'elysia'

/**
 * Tratamento central de erros (escopo global).
 * - Validação de schema (Zod via Standard Schema) → 400
 * - Violação de unique constraint do Postgres (code 23505) → 409
 * - Qualquer outro erro → 500
 */
export const errorHandler = new Elysia({ name: 'error-handler' }).onError(
  { as: 'global' },
  ({ code, error, status }) => {
    if (code === 'VALIDATION') {
      return status(400, summarizeValidation(error.message))
    }

    if (isUniqueViolation(error)) {
      return status(409, { message: 'Email já cadastrado' })
    }

    console.error(error)
    return status(500, { message: 'Erro interno do servidor' })
  },
)

/**
 * Extrai uma mensagem concisa do erro de validação do Elysia (JSON serializado).
 */
function summarizeValidation(raw: string): { message: string; field?: string } {
  try {
    const parsed = JSON.parse(raw) as { message?: string; property?: string }
    return {
      message: parsed.message ?? 'Payload inválido',
      field: parsed.property?.replace(/^\//, '') || undefined,
    }
  } catch {
    return { message: 'Payload inválido' }
  }
}

/**
 * Drizzle encapsula o erro do driver: o código do Postgres fica em `error.cause`.
 * Percorremos a cadeia de causas procurando o code `23505` (unique_violation).
 */
function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error

  while (current && typeof current === 'object') {
    if ((current as { code?: string }).code === '23505') {
      return true
    }
    current = (current as { cause?: unknown }).cause
  }

  return false
}

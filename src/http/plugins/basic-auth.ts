import { createHash, timingSafeEqual } from 'node:crypto'
import { Elysia, status } from 'elysia'
import { env } from '@/env'

const WWW_AUTHENTICATE = 'Basic realm="Cantera Admin", charset="UTF-8"'

// Compara hashes de tamanho fixo em vez das strings originais para evitar
// que timingSafeEqual rejeite cedo por diferença de comprimento.
function safeCompare(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export const basicAuth = new Elysia({ name: 'basic-auth' }).macro({
  basicAuth: {
    resolve({ headers, set }) {
      const authorization = headers.authorization

      if (!authorization?.startsWith('Basic ')) {
        set.headers['WWW-Authenticate'] = WWW_AUTHENTICATE
        return status(401, 'Unauthorized')
      }

      const decoded = Buffer.from(authorization.slice(6), 'base64').toString(
        'utf-8',
      )
      const separatorIndex = decoded.indexOf(':')
      const user =
        separatorIndex === -1 ? decoded : decoded.slice(0, separatorIndex)
      const password =
        separatorIndex === -1 ? '' : decoded.slice(separatorIndex + 1)

      const isValid =
        safeCompare(user, env.ADMIN_USER) &&
        safeCompare(password, env.ADMIN_PASSWORD)

      if (!isValid) {
        set.headers['WWW-Authenticate'] = WWW_AUTHENTICATE
        return status(401, 'Unauthorized')
      }

      return { adminUser: user }
    },
  },
})

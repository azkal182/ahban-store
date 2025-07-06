// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/named
import NextAuth, { DefaultSession } from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/named
import { JWT as DefaultJWT } from '@auth/core/jwt'

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      username: string
    }
  }

  interface User {
    id: string
    username: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
  }
}

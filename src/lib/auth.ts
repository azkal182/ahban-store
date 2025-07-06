import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

// @ts-ignore
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async credentials => {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username
          }
        })

        console.log({ user })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValid) {
          return null
        }

        // Remove sensitive fields before returning
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = user

        return safeUser
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    // @ts-ignore
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }

      return token
    },

    // @ts-ignore
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          id: token.id as string,
          username: token.username as string
        }
      } else {
        session.user = undefined
      }

      return session
    }
  }
})

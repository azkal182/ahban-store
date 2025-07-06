import CredentialsProvider from 'next-auth/providers/credentials'

import bcrypt from 'bcryptjs'

import type { NextAuthConfig } from 'next-auth'

import { prisma } from '@/lib/prisma'

const authConfig = {
  // adapter: PrismaAdapter(prisma),
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
    signIn: '/login'
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
        // @ts-ignore
        session.user = {
          id: token.id as string,
          username: token.username as string
        }
      } else {
        // @ts-ignore
        session.user = undefined
      }

      return session
    }
  }
} satisfies NextAuthConfig

export default authConfig

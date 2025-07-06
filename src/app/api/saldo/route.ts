import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const session = await auth()

  //   @ts-ignore
  const userId = session.user.id

  const data = await prisma.user.findUnique({
    where: { id: userId }
  })

  return NextResponse.json(data)
}

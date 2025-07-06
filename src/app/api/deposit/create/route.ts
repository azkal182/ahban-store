import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { getMidtransCore } from '@/lib/midtrans'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()
    const session = await auth()

    console.log({ session })

    if (!session?.user?.id || !amount || amount < 1000) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const userId = session.user.id
    const orderId = `QRIS-${Date.now()}`

    // Simpan transaksi awal
    await prisma.deposit.create({
      data: { userId, amount, status: 'pending', orderId }
    })

    const core = getMidtransCore()

    const response = await core.charge({
      payment_type: 'qris',
      transaction_details: { order_id: orderId, gross_amount: amount }
    })

    const qrisUrl = response.actions?.find((a: any) => a.name === 'generate-qr-code')?.url

    if (!qrisUrl) {
      return NextResponse.json({ error: 'Failed to generate QRIS' }, { status: 500 })
    }

    return NextResponse.json({
      qris_url: qrisUrl,
      order_id: orderId
    })
  } catch (error) {
    console.error('[QRIS_DEPOSIT_ERROR]', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

import crypto from 'crypto'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

function validateSignature(body: any) {
  const { order_id, status_code, gross_amount, signature_key } = body
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const input = order_id + status_code + gross_amount + serverKey
  const expected = crypto.createHash('sha512').update(input).digest('hex')

  return expected === signature_key
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!validateSignature(body)) return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })

  const { order_id, transaction_status, payment_type, transaction_time } = body

  await prisma.depositLog.create({
    data: { orderId: order_id, payload: body }
  })

  const deposit = await prisma.deposit.findUnique({ where: { orderId: order_id } })

  if (!deposit) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (transaction_status === 'settlement' && deposit.status !== 'success') {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: deposit.userId },
        data: { balance: { increment: deposit.amount } }
      }),
      prisma.deposit.update({
        where: { orderId: order_id },
        data: {
          status: 'success',
          paymentType: payment_type,
          transactionAt: new Date(transaction_time)
        }
      })
    ])
  } else if (['cancel', 'expire'].includes(transaction_status)) {
    await prisma.deposit.update({
      where: { orderId: order_id },
      data: { status: 'failed' }
    })
  }

  return NextResponse.json({ success: true })
}

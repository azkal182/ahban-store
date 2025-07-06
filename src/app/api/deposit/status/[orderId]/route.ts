import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

// Response type for type safety
interface DepositResponse {
  status: string
}

// Error response type
interface ErrorResponse {
  error: string
}

/**
 * GET handler for retrieving deposit status by order ID
 * @param _request - The incoming Next.js request object
 * @param params - Route parameters containing the orderId
 * @returns JSON response with deposit status or error message
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    // Await params to get orderId
    const { orderId } = await params

    // Validate orderId
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json<ErrorResponse>({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Query deposit with specific field selection
    const deposit = await prisma.deposit.findUnique({
      where: { orderId },
      select: { status: true }
    })

    // Handle not found case
    if (!deposit) {
      return NextResponse.json<ErrorResponse>({ error: 'Deposit not found' }, { status: 404 })
    }

    // Return successful response
    const response: DepositResponse = { status: deposit.status }

    return NextResponse.json<DepositResponse>(response, { status: 200 })
  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error('Error fetching deposit:', error)

    // Return generic error response
    return NextResponse.json<ErrorResponse>({ error: 'Internal server error' }, { status: 500 })
  }
}

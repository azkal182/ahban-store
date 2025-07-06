// @ts-ignore
import midtransClient from 'midtrans-client'

export function getMidtransCore() {
  return new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY!
  })
}

// app/api/cekkuota/route.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const number = body.number

    if (!number) {
      return NextResponse.json({ error: 'Number is required' }, { status: 400 })
    }

    const res = await fetch('https://sidompul.hijaubiru.my.id/backend.php', {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        origin: 'https://cekkuota.robych.my.id',
        pragma: 'no-cache',
        priority: 'u=1, i',
        referer: 'https://cekkuota.robych.my.id/',
        'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        action: 'check_package',
        device_id: 'fake',
        number: number
      })
    })

    const data = await res.json()

    console.log(data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error checking package:', error)

    return NextResponse.json({ error: 'Failed to check package' }, { status: 500 })
  }
}

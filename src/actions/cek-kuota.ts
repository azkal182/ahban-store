// lib/actions/cekKuota.ts
'use server'

import type { SidompulResponse } from '@/types/sidompul'

export async function cekKuotaXL(number: string): Promise<SidompulResponse | null> {
  try {
    const res = await fetch('https://sidompul.hijaubiru.my.id/backend.php', {
      method: 'POST',
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: 'https://cekkuota.robych.my.id',
        referer: 'https://cekkuota.robych.my.id/',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        action: 'check_package',
        device_id: 'fake',
        number
      }),
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error('Failed to fetch:', res.status)

      return null
    }

    const data: SidompulResponse = await res.json()

    console.log('Cek Kuota Response:', JSON.stringify(data, null, 2))

    return data
  } catch (err) {
    console.error('Error:', err)

    return null
  }
}

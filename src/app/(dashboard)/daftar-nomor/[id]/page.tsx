import { Card, CardContent, Typography } from '@mui/material'

import { getDetailNomorLogin } from '@/actions/akrab'
import AkrabManagement from './page.client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getDetailNomorLogin(id)

  if (!data) {
    return (
      <Card className='shadow-lg'>
        <CardContent>
          <Typography variant='body1' className='text-center'>
            Data tidak ditemukan.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return <AkrabManagement {...data} />
}

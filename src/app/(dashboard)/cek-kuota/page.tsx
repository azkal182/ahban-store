'use client'

import { useState, useTransition } from 'react'

import { Box, Button, Container, Divider, LinearProgress, Typography, Paper, Grid } from '@mui/material'

import type { SidompulResponse } from '@/types/sidompul'
import { cekKuotaXL } from '@/actions/cek-kuota'
import CustomTextField from '@/@core/components/mui/TextField'
import { hasAkrabPackage } from '@/lib/hasAkrabPackage'
import { infoSlotAkrab } from '@/actions/akrab'

export default function CekKuotaUI() {
  const [nomor, setNomor] = useState('087833372003')
  const [data, setData] = useState<SidompulResponse | null>(null)
  const [loading, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await cekKuotaXL(nomor)

      if (result && hasAkrabPackage(result)) {
        alert('Ada paket Akrab')
      } else {
        alert('Tidak ada paket Akrab')
      }

      setData(result)
    })
  }

  const handleCekSlot = () => {
    const form = new FormData()

    form.append('nomor_hp', nomor)

    startTransition(async () => {
      const result = await infoSlotAkrab(form)

      if (result.success) {
        alert(`Slot berhasil disinkronkan: ${result.data.slotKe}`)
      } else {
        alert(`Gagal sinkronisasi slot: ${result.error}`)
      }
    })
  }

  return (
    <Container maxWidth='sm' sx={{ py: 4 }}>
      <Box display='flex' flexDirection='column' gap={2}>
        <CustomTextField label='Nomor HP' fullWidth value={nomor} onChange={e => setNomor(e.target.value)} />

        <Button fullWidth variant='contained' onClick={handleSubmit} disabled={loading}>
          {loading ? 'Memuat...' : 'Cek Paket'}
        </Button>
        <Button fullWidth variant='contained' onClick={handleCekSlot} disabled={loading}>
          {loading ? 'Memuat...' : 'Cek slot Akrab'}
        </Button>

        {data && data.success && (
          <div className='space-y-4 mt-4'>
            {/* Info Kartu */}
            <Paper variant='outlined' sx={{ p: 2 }}>
              <Typography variant='h6' gutterBottom>
                Info Kartu
              </Typography>

              <Grid container spacing={1}>
                <Grid item xs={5}>
                  <Typography>Nomor</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {nomor}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography>Provider</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {data.data.prefix.value}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography>KTP Dukcapil</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {data.data.dukcapil.value}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography>Jaringan</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {data.data.status_4g.value}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography>Umur Kartu</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {data.data.active_card.value}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography>Aktif Sampai</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {data.data.active_period.value}</Typography>
                </Grid>

                <Grid item xs={5}>
                  <Typography>Masa Tenggang</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography>: {data.data.grace_period.value}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Paket Kuota */}
            {data.data.quotas.value.map((group, i) => (
              <Paper key={i} variant='outlined' sx={{ p: 2 }}>
                <Typography variant='h6' gutterBottom>
                  📗 {group.name}
                </Typography>

                {group.detail_quota.map((quota, j) => (
                  <Box key={j} mb={2}>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='body1'>{quota.name}</Typography>
                      <Typography variant='body2'>
                        {quota.remaining_text} / {quota.total_text}
                      </Typography>
                    </Box>
                    <LinearProgress variant='determinate' value={quota.percent} />
                  </Box>
                ))}

                <Divider sx={{ my: 1 }} />
                <Typography variant='body1'>📅 Reset Kuota: {group.date_end} WIB</Typography>
              </Paper>
            ))}
          </div>
        )}
      </Box>
    </Container>
  )
}

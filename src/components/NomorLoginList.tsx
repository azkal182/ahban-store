'use client'

import React, { useState } from 'react'

import Link from 'next/link'

import { Card, CardContent, Typography, Grid, Chip } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

interface NomorLoginItem {
  id: string
  nomorHp: string
  name: string | null
  kategori: string | null
  slotKosong: number
  bekasanKosong: number
}

interface NomorLoginListProps {
  data: NomorLoginItem[]
}

const NomorLoginList: React.FC<NomorLoginListProps> = ({ data }) => {
  const [search, setSearch] = useState('')

  const filtered = data.filter(item => {
    const q = search.toLowerCase()

    return item.nomorHp.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q)
  })

  return (
    <div>
      <CustomTextField
        label='Cari Nomor atau Nama'
        fullWidth
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filtered.map(login => (
          <Grid item xs={12} md={6} lg={4} key={login.id}>
            <Card>
              <CardContent>
                <Link href={`/daftar-nomor/${login.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant='h6' gutterBottom>
                    {login.name || 'Tanpa Nama'}
                  </Typography>
                </Link>
                <Typography variant='body2' color='text.secondary'>
                  {login.nomorHp}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Kategori: <strong>{login.kategori || '-'}</strong>
                </Typography>
                <Chip
                  label={`Slot fresh: ${login.slotKosong}`}
                  color={login.slotKosong > 0 ? 'success' : 'default'}
                  sx={{ mt: 1 }}
                />

                <Chip
                  label={`Slot bekasan: ${login.bekasanKosong}`}
                  color={login.bekasanKosong > 0 ? 'success' : 'default'}
                  sx={{ mt: 1, ml: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default NomorLoginList

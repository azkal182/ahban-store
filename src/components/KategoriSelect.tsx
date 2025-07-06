'use client'

import React, { useEffect, useState } from 'react'

import { FormControl, MenuItem } from '@mui/material'

import { listKategoriWithSlotCount } from '@/actions/akrab'
import CustomTextField from '@/@core/components/mui/TextField'

interface KategoriOption {
  id: string
  nama: string
  slotKosong: number
}

interface KategoriSelectProps {
  onChange: (id: string) => void
}

const KategoriSelect: React.FC<KategoriSelectProps> = ({ onChange }) => {
  const [options, setOptions] = useState<KategoriOption[]>([])
  const [value, setValue] = useState('')

  useEffect(() => {
    listKategoriWithSlotCount().then(setOptions)
  }, [])

  const handleChange = (e: any) => {
    const id = e.target.value as string

    setValue(id)
    onChange(id)
  }

  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <CustomTextField select value={value} label='Paket Akrab' onChange={handleChange}>
        <MenuItem value=''>Semua Kategori</MenuItem>
        {options.map(opt => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.nama} - {opt.slotKosong} slot
          </MenuItem>
        ))}
      </CustomTextField>
    </FormControl>
  )
}

export default KategoriSelect

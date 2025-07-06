// 'use client'

// import { useState } from 'react'

// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel
// } from '@mui/material'
// import type { GridColDef } from '@mui/x-data-grid'
// import { DataGrid } from '@mui/x-data-grid'

// type Member = {
//   number: string
//   alias: string
//   quota: number
// }

// type Slot = {
//   slotId: string
//   member: Member | null
//   changeLimit: number
//   keterangan: string
// }

// export default function PageClient() {
//   const [slots, setSlots] = useState<Slot[]>([
//     { slotId: 'slot1', member: null, changeLimit: 3, keterangan: 'Fresh' },
//     { slotId: 'slot2', member: null, changeLimit: 3, keterangan: 'Fresh' },
//     { slotId: 'slot3', member: null, changeLimit: 3, keterangan: 'Fresh' },
//     { slotId: 'slot4', member: null, changeLimit: 3, keterangan: 'Fresh' }
//   ])

//   const [newMember, setNewMember] = useState<{ slotId: string; number: string; alias: string; quota: string }>({
//     slotId: '',
//     number: '',
//     alias: '',
//     quota: ''
//   })

//   const columns: GridColDef[] = [
//     { field: 'slotId', headerName: 'Slot ID', width: 100 },
//     {
//       field: 'alias',
//       headerName: 'Nama Alias',
//       width: 150,
//       valueGetter: (value, row) => {
//         return row.member?.alias || '-'
//       }
//     },
//     {
//       field: 'number',
//       headerName: 'Nomor',
//       width: 150,
//       valueGetter: (value, row) => {
//         return row.member?.number || '-'
//       }
//     },
//     {
//       field: 'quota',
//       headerName: 'Kuota (GB)',
//       width: 100,
//       valueGetter: (value, row) => {
//         return row.member?.quota || '-'
//       }
//     },
//     { field: 'changeLimit', headerName: 'Sisa Pergantian', width: 120 },
//     {
//       field: 'keterangan',
//       headerName: 'Keterangan',
//       width: 120,
//       valueGetter: (value, row) => {
//         if (row.changeLimit === 3) return 'Fresh'
//         if (row.changeLimit > 0 && row.changeLimit < 3) return 'Bekasan'

//         return '-'
//       }
//     },
//     {
//       field: 'actions',
//       headerName: 'Aksi',
//       width: 100,
//       renderCell: params =>
//         params.row.member ? (
//           <Button
//             variant='contained'
//             color='error'
//             size='small'
//             onClick={() => kickMember(params.row.slotId)}
//             className='bg-red-500 hover:bg-red-600'
//           >
//             Kick
//           </Button>
//         ) : null
//     }
//   ]

//   const handleAddMember = () => {
//     if (!newMember.slotId) {
//       alert('Pilih slot terlebih dahulu!')

//       return
//     }

//     if (!newMember.number || !newMember.alias || !newMember.quota) {
//       alert('Lengkapi semua data anggota!')

//       return
//     }

//     if (
//       slots.filter(slot => slot.member).length >= 4 &&
//       !slots.find(slot => slot.slotId === newMember.slotId)?.member
//     ) {
//       alert('Semua slot anggota telah penuh (maksimal 4)!')

//       return
//     }

//     if (slots.find(slot => slot.slotId === newMember.slotId)?.changeLimit === 0) {
//       alert(`Slot ${newMember.slotId} telah mencapai batas pergantian (3 kali)!`)

//       return
//     }

//     setSlots(
//       slots.map(slot => {
//         if (slot.slotId === newMember.slotId) {
//           return {
//             ...slot,
//             member: { number: newMember.number, alias: newMember.alias, quota: parseInt(newMember.quota) },
//             changeLimit: slot.member ? slot.changeLimit - 1 : slot.changeLimit,
//             keterangan: slot.changeLimit === 3 ? 'Fresh' : 'Bekasan'
//           }
//         }

//         return slot
//       })
//     )
//     setNewMember({ slotId: '', number: '', alias: '', quota: '' })
//   }

//   const kickMember = (slotId: string) => {
//     const slot = slots.find(s => s.slotId === slotId)

//     if (slot && slot.changeLimit <= 0) {
//       alert(`Slot ${slotId} telah mencapai batas pergantian (3 kali)!`)

//       return
//     }

//     setSlots(
//       slots.map(slot => {
//         if (slot.slotId === slotId) {
//           return {
//             ...slot,
//             member: null,
//             changeLimit: slot.changeLimit - 1,
//             keterangan: slot.changeLimit - 1 === 0 ? '-' : 'Bekasan'
//           }
//         }

//         return slot
//       })
//     )
//   }

//   return (
//     <Container maxWidth='md' className='py-8'>
//       <Typography variant='h4' className='font-bold text-gray-800 mb-6 text-center'>
//         Manajemen Paket Akrab
//       </Typography>
//       <Card className='shadow-lg'>
//         <CardContent>
//           <Typography variant='body1' className='mb-4'>
//             Paket Akrab aktif! Anda dapat mengelola hingga 4 anggota.
//           </Typography>

//           {/* Form Tambah Anggota */}
//           <Grid container spacing={2} className='mb-6'>
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <InputLabel>Pilih Slot</InputLabel>
//                 <Select
//                   value={newMember.slotId}
//                   onChange={e => setNewMember({ ...newMember, slotId: e.target.value })}
//                   label='Pilih Slot'
//                 >
//                   <MenuItem value=''>Pilih Slot</MenuItem>
//                   {slots
//                     .filter(slot => !slot.member || slot.slotId === newMember.slotId)
//                     .map(slot => (
//                       <MenuItem key={slot.slotId} value={slot.slotId}>
//                         {slot.slotId}
//                       </MenuItem>
//                     ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 fullWidth
//                 label='Nomor Telepon'
//                 value={newMember.number}
//                 onChange={e => setNewMember({ ...newMember, number: e.target.value })}
//                 variant='outlined'
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 fullWidth
//                 label='Nama Alias'
//                 value={newMember.alias}
//                 onChange={e => setNewMember({ ...newMember, alias: e.target.value })}
//                 variant='outlined'
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 fullWidth
//                 label='Kuota (GB)'
//                 type='number'
//                 value={newMember.quota}
//                 onChange={e => setNewMember({ ...newMember, quota: e.target.value })}
//                 variant='outlined'
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button
//                 variant='contained'
//                 className='bg-blue-500 hover:bg-blue-600 w-full sm:w-auto'
//                 onClick={handleAddMember}
//               >
//                 Tambah Anggota
//               </Button>
//             </Grid>
//           </Grid>

//           {/* Daftar Anggota */}
//           <Typography variant='h6' className='font-medium mb-2'>
//             Daftar Anggota (4 slot)
//           </Typography>
//           <div style={{ height: 400, width: '100%' }}>
//             <DataGrid
//               rows={slots}
//               columns={columns}
//               getRowId={row => row.slotId}
//               pageSizeOptions={[5]}
//               disableRowSelectionOnClick
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </Container>
//   )
// }

// 'use client'

// import { useState } from 'react'

// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel
// } from '@mui/material'
// import type { GridColDef } from '@mui/x-data-grid'
// import { DataGrid } from '@mui/x-data-grid'
// import { toast } from 'react-toastify'

// import { addAkrab, kickAkrab } from '@/actions/akrab'
// import CustomTextField from '@/@core/components/mui/TextField'

// type Slot = {
//   slotKe: number
//   slotId: number
//   alias: string | null
//   nomor: string | null
//   sisaAdd: number | null
//   kuotaBersama: number | null
//   pemakaianKuotaBersama: number | null
//   totalKuotaBenefit: number | null
//   sisaKuotaBenefit: number | null
//   keterangan?: string
// }

// type AkrabManagementProps = {
//   id: string
//   nomorHp: string
//   name: string | null
//   kategori: string | null
//   expired: string | null
//   slots: Slot[]
// }

// export default function AkrabManagement({
//   id,
//   nomorHp,
//   name,
//   kategori,
//   expired,
//   slots: initialSlots
// }: AkrabManagementProps) {
//   const [slots] = useState<Slot[]>(
//     initialSlots?.map(slot => ({
//       ...slot,
//       keterangan: slot.sisaAdd === 3 ? 'Fresh' : slot.sisaAdd === 2 && slot.nomor !== '' ? 'Fresh' : 'Bekasan'
//     }))
//   )

//   const [newMember, setNewMember] = useState<{ slotKe: string; nomor: string; alias: string; kuotaBersama: string }>({
//     slotKe: '',
//     nomor: '',
//     alias: '',
//     kuotaBersama: ''
//   })

//   const columns: GridColDef[] = [
//     { field: 'slotKe', headerName: 'Slot Ke', width: 100 },
//     { field: 'slotId', headerName: 'Slot ID', width: 100 },
//     {
//       field: 'alias',
//       headerName: 'Nama Alias',
//       width: 150,
//       valueGetter: (value, row) => row.alias || '-'
//     },
//     {
//       field: 'nomor',
//       headerName: 'Nomor',
//       width: 150,
//       valueGetter: (value, row) => row.nomor || '-'
//     },
//     {
//       field: 'kuotaBersama',
//       headerName: 'Kuber (GB)',
//       width: 120,
//       valueGetter: (value, row) => row.kuotaBersama || '-'
//     },
//     {
//       field: 'pemakaianKuotaBersama',
//       headerName: 'Pemakaian kuber (GB)',
//       width: 120,
//       valueGetter: (value, row) => row.pemakaianKuotaBersama || '-'
//     },
//     {
//       field: 'totalKuotaBenefit',
//       headerName: 'Total Kuota Lokal (GB)',
//       width: 120,
//       valueGetter: (value, row) => row.totalKuotaBenefit || '-'
//     },
//     {
//       field: 'sisaKuotaBenefit',
//       headerName: 'Sisa Kuota Lokal (GB)',
//       width: 120,
//       valueGetter: (value, row) => row.sisaKuotaBenefit || '-'
//     },
//     { field: 'sisaAdd', headerName: 'Sisa add', width: 120 },
//     {
//       field: 'keterangan',
//       headerName: 'Keterangan',
//       width: 120,
//       valueGetter: (value, row) => row.keterangan
//     },
//     {
//       field: 'actions',
//       headerName: 'Aksi',
//       width: 100,
//       renderCell: params =>
//         params.row.nomor ? (
//           <Button
//             variant='contained'
//             color='error'
//             size='small'
//             disabled={params.row.sisaAdd === 0}
//             onClick={() => kickMember(params.row.slotKe, nomorHp)}
//             className='bg-red-500 hover:bg-red-600'
//           >
//             Kick
//           </Button>
//         ) : null
//     }
//   ]

//   const handleAddMember = () => {
//     const form = new FormData()

//     form.append('nomor_slot', newMember.slotKe)
//     form.append('nomor_anggota', newMember.nomor)
//     form.append('nomor_hp', nomorHp)
//     form.append('nama_anggota', newMember.alias)
//     form.append('nama_admin', newMember.alias)
//     form.append('input_gb', newMember.kuotaBersama)

//     // console.log('Form Data:', Object.fromEntries(form.entries()))
//     addAkrab(form).then(res => {
//       if (res.success) {
//         toast.success(`${newMember.nomor} berhasil ditambahkan`)
//       } else {
//         toast.error(res.error || `${newMember.nomor} gagal ditambahkan`)
//       }
//     })
//   }

//   const kickMember = (nomor_slot: number, nomorHp: string) => {
//     const form = new FormData()

//     form.append('nomor_slot', nomor_slot.toString())
//     form.append('nomor_hp', nomorHp)

//     // console.log('Form Data Kick:', Object.fromEntries(form.entries()))
//     kickAkrab(form).then(res => {
//       if (res.success) {
//         toast.success(`${newMember.nomor} berhasil kick`)
//       } else {
//         toast.error(res.error || `${newMember.nomor} gagal dikick`)
//       }
//     })

//     // Biarkan kosong sesuai permintaan
//   }

//   const slotEmpty = slots?.filter(slot => slot.nomor === null || slot.nomor === '').length === 0

//   return (
//     <Container maxWidth='md' className='py-8'>
//       <Typography variant='h4' className='font-bold  mb-6 text-center'>
//         Manajemen Paket Akrab
//       </Typography>
//       <Card className='shadow-lg'>
//         <CardContent>
//           <Typography variant='h5' fontWeight='bold' gutterBottom>
//             Detail Nomor Login
//           </Typography>

//           {/* Informasi Dasar */}
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={4}>
//               <Typography fontWeight='bold'>Nomor Pengelola</Typography>
//             </Grid>
//             <Grid item xs={12} sm={8}>
//               <Typography>{nomorHp}</Typography>
//             </Grid>

//             <Grid item xs={12} sm={4}>
//               <Typography fontWeight='bold'>Nama</Typography>
//             </Grid>
//             <Grid item xs={12} sm={8}>
//               <Typography>{name}</Typography>
//             </Grid>

//             <Grid item xs={12} sm={4}>
//               <Typography fontWeight='bold'>Kategori</Typography>
//             </Grid>
//             <Grid item xs={12} sm={8}>
//               <Typography>{kategori || '-'}</Typography>
//             </Grid>
//           </Grid>

//           {/* Form Tambah Anggota */}
//           <Grid container spacing={2} className='mb-6 mt-4'>
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <CustomTextField
//                   disabled={slotEmpty}
//                   placeholder='Pilih Slot'
//                   select
//                   value={newMember.slotKe}
//                   onChange={e => setNewMember({ ...newMember, slotKe: e.target.value })}
//                   label='Pilih Slot'
//                 >
//                   <MenuItem value=''>Pilih Slot</MenuItem>
//                   {slots
//                     ?.filter(slot => !slot.nomor || slot.slotId === parseInt(newMember.slotKe))
//                     .map(slot => (
//                       <MenuItem key={slot.slotId} value={slot.slotKe.toString()}>
//                         Slot {slot.slotKe}
//                       </MenuItem>
//                     ))}
//                 </CustomTextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <CustomTextField
//                 fullWidth
//                 disabled={slotEmpty}
//                 label='Nomor Telepon'
//                 placeholder='Nomor Telepon'
//                 value={newMember.nomor}
//                 onChange={e => setNewMember({ ...newMember, nomor: e.target.value })}
//                 variant='outlined'
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <CustomTextField
//                 disabled={slotEmpty}
//                 fullWidth
//                 label='Nama Alias'
//                 placeholder='Nama Alias'
//                 value={newMember.alias}
//                 onChange={e => setNewMember({ ...newMember, alias: e.target.value })}
//                 variant='outlined'
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <CustomTextField
//                 disabled={slotEmpty}
//                 fullWidth
//                 label='Kuota Bersama (GB)'
//                 placeholder='Kuota Bersama (GB)'
//                 type='number'
//                 value={newMember.kuotaBersama}
//                 onChange={e => setNewMember({ ...newMember, kuotaBersama: e.target.value })}
//                 variant='outlined'
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button
//                 disabled={!newMember.slotKe || !newMember.nomor || !newMember.alias || !newMember.kuotaBersama}
//                 variant='contained'
//                 className='bg-blue-500 hover:bg-blue-600 w-full sm:w-auto'
//                 onClick={handleAddMember}
//               >
//                 Tambah Anggota
//               </Button>
//             </Grid>
//           </Grid>

//           {/* Daftar Anggota */}
//           <Typography variant='h6' className='font-medium mb-2'>
//             Daftar Anggota ({slots?.length} slot)
//           </Typography>
//           <div style={{ height: 400, width: '100%' }}>
//             <DataGrid
//               rows={slots}
//               columns={columns}
//               getRowId={row => row.slotId}
//               pageSizeOptions={[5]}
//               disableRowSelectionOnClick
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </Container>
//   )
// }

'use client'

import { useState } from 'react'

import { Container, Typography, Card, CardContent, Grid, Button, MenuItem, FormControl } from '@mui/material'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { addAkrab, kickAkrab } from '@/actions/akrab'

type Slot = {
  slotKe: number
  slotId: number
  alias: string | null
  nomor: string | null
  sisaAdd: number | null
  kuotaBersama: number | null
  pemakaianKuotaBersama: number | null
  totalKuotaBenefit: number | null
  sisaKuotaBenefit: number | null
  keterangan?: string
}

type AkrabManagementProps = {
  id: string
  nomorHp: string
  name: string | null
  kategori: string | null
  expired: string | null
  slots: Slot[]
}

export default function AkrabManagement({
  nomorHp,
  name,
  kategori,
  expired,
  slots: initialSlots
}: AkrabManagementProps) {
  const [slots] = useState<Slot[]>(
    initialSlots?.map(slot => ({
      ...slot,
      keterangan: slot.sisaAdd === 3 ? 'Fresh' : slot.sisaAdd === 2 && slot.nomor !== '' ? 'Fresh' : 'Bekasan'
    }))
  )

  const [newMember, setNewMember] = useState<{ slotKe: string; nomor: string; alias: string; kuotaBersama: string }>({
    slotKe: '',
    nomor: '',
    alias: '',
    kuotaBersama: ''
  })

  const handleAddMember = () => {
    const form = new FormData()

    form.append('nomor_slot', newMember.slotKe)
    form.append('nomor_anggota', newMember.nomor)
    form.append('nomor_hp', nomorHp)
    form.append('nama_anggota', newMember.alias)
    form.append('nama_admin', newMember.alias)
    form.append('input_gb', newMember.kuotaBersama)

    addAkrab(form).then(res => {
      if (res.success) {
        toast.success(`${newMember.nomor} berhasil ditambahkan`)
      } else {
        toast.error(res.error || `${newMember.nomor} gagal ditambahkan`)
      }
    })
  }

  const kickMember = (nomor_slot: number, nomorHp: string) => {
    const form = new FormData()

    form.append('nomor_slot', nomor_slot.toString())
    form.append('nomor_hp', nomorHp)

    kickAkrab(form).then(res => {
      if (res.success) {
        toast.success(`${newMember.nomor} berhasil kick`)
      } else {
        toast.error(res.error || `${newMember.nomor} gagal dikick`)
      }
    })
  }

  const slotEmpty = slots?.filter(slot => slot.nomor === null || slot.nomor === '').length === 0

  return (
    <Container maxWidth='md' className='py-8'>
      <Typography variant='h4' className='font-bold mb-6 text-center'>
        Manajemen Paket Akrab
      </Typography>
      <Card className='shadow-lg'>
        <CardContent>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            Detail Nomor Login
          </Typography>

          {/* Informasi Dasar */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography fontWeight='bold'>Nomor Pengelola</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography>{nomorHp}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontWeight='bold'>Nama</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography>{name || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontWeight='bold'>Kategori</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography>{kategori || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontWeight='bold'>Expired</Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography>{expired || '-'}</Typography>
            </Grid>
          </Grid>

          {/* Form Tambah Anggota */}
          <Grid container spacing={2} className='mb-6 mt-4'>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <CustomTextField
                  disabled={slotEmpty}
                  placeholder='Pilih Slot'
                  select
                  value={newMember.slotKe}
                  onChange={e => setNewMember({ ...newMember, slotKe: e.target.value })}
                  label='Pilih Slot'
                >
                  <MenuItem value=''>Pilih Slot</MenuItem>
                  {slots
                    ?.filter(slot => !slot.nomor || slot.slotId === parseInt(newMember.slotKe))
                    .map(slot => (
                      <MenuItem key={slot.slotId} value={slot.slotKe.toString()}>
                        Slot {slot.slotKe}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                disabled={slotEmpty}
                fullWidth
                label='Nomor Telepon'
                placeholder='Nomor Telepon'
                value={newMember.nomor}
                onChange={e => setNewMember({ ...newMember, nomor: e.target.value })}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                disabled={slotEmpty}
                fullWidth
                label='Nama Alias'
                placeholder='Nama Alias'
                value={newMember.alias}
                onChange={e => setNewMember({ ...newMember, alias: e.target.value })}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                disabled={slotEmpty}
                fullWidth
                label='Kuota Bersama (GB)'
                placeholder='Kuota Bersama (GB)'
                type='number'
                value={newMember.kuotaBersama}
                onChange={e => setNewMember({ ...newMember, kuotaBersama: e.target.value })}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={!newMember.slotKe || !newMember.nomor || !newMember.alias || !newMember.kuotaBersama}
                variant='contained'
                className='bg-blue-500 hover:bg-blue-600 w-full sm:w-auto'
                onClick={handleAddMember}
              >
                Tambah Anggota
              </Button>
            </Grid>
          </Grid>

          {/* Daftar Anggota */}
          <Typography variant='h6' className='font-medium mb-4'>
            Daftar Anggota ({slots?.length} slot)
          </Typography>
          <Grid container spacing={2}>
            {slots?.map(slot => (
              <Grid item xs={12} sm={6} md={4} key={slot.slotId}>
                <Card className='shadow-md'>
                  <CardContent>
                    <Typography variant='h6' className='font-bold mb-2'>
                      Slot {slot.slotKe} ({slot.keterangan})
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Slot ID</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.slotId}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Nama</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.alias || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Nomor</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.nomor?.replace('62', '0') || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Kuber (GB)</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.kuotaBersama || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Pemakaian Kuber (GB)</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.pemakaianKuotaBersama || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Total Kuota Lokal (GB)</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.totalKuotaBenefit || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Sisa Kuota Lokal (GB)</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.sisaKuotaBenefit || '-'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography fontWeight='bold'>Sisa Add</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>: {slot.sisaAdd || '-'}</Typography>
                      </Grid>

                      {slot.nomor && (
                        <Grid item xs={12} className='mt-2'>
                          <Button
                            variant='contained'
                            color='error'
                            size='small'
                            disabled={slot.sisaAdd === 0}
                            onClick={() => kickMember(slot.slotKe, nomorHp)}
                            className='bg-red-500 hover:bg-red-600 w-full'
                          >
                            Kick
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

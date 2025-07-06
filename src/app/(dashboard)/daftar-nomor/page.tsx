'use client'

import React, { useEffect, useState, useTransition } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { Button, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import { getCategories, getOtp, listNomorLoginWithSlotKosong, loginNomor } from '@/actions/akrab'
import CustomTextField from '@/@core/components/mui/TextField'
import NomorLoginList from '@/components/NomorLoginList'

interface NomorLoginItem {
  id: string
  nomorHp: string
  name: string | null
  kategori: string | null
  slotKosong: number
  bekasanKosong: number
}

const DaftarNomorPage = () => {
  const [step, setStep] = useState<'input' | 'otp'>('input')
  const [isPending, startTransition] = useTransition()
  const [nomor, setNomor] = useState<NomorLoginItem[]>([])
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useForm({ defaultValues: { nomor_hp: '', kode_otp: '', name: '', kategori: '' } })

  const onRequestOtp = ({ nomor_hp, name, kategori }: { nomor_hp: string; name: string; kategori: string }) => {
    const formData = new FormData()

    formData.append('nomor_hp', nomor_hp)
    formData.append('name', name) // Tambahkan name ke form data
    formData.append('kategori', kategori) // Sertakan kategori yang dipilih

    startTransition(() => {
      getOtp(formData).then(res => {
        if (res.success) {
          setStep('otp')
          toast.success('OTP berhasil dikirim')
        } else {
          toast.error(res.error || 'Gagal request OTP')
        }
      })
    })
  }

  const onLogin = ({ kode_otp }: { kode_otp: string }) => {
    const nomor_hp = getValues('nomor_hp') // Ambil nomor_hp dari form
    const name = getValues('name') // Ambil name dari form
    const kategori = getValues('kategori') // Ambil kategori dari form
    const formData = new FormData()

    formData.append('nomor_hp', nomor_hp)
    formData.append('kode_otp', kode_otp)
    formData.append('name', name) // Sertakan name di form data saat login
    formData.append('kategori', kategori) // Sertakan kategori yang dipilih

    startTransition(() => {
      loginNomor(formData).then(res => {
        if (res.success) {
          alert('Login berhasil')

          // redirect or store token
        } else {
          alert(res.error || 'Login gagal')
        }
      })
    })
  }

  const getData = async () => {
    const data = await listNomorLoginWithSlotKosong()

    console.log('Data Nomor Login:', JSON.stringify(data, null, 2))
    setNomor(data)
  }

  useEffect(() => {
    getData()
    getCategories().then(res => setCategories(res)) // Ambil data kategori dari API
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit(onRequestOtp)} className='space-y-4 sm:space-y-6'>
        <h2 className='text-xl font-semibold'>Login Nomor</h2>
        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-end'>
          <CustomTextField
            type='text'
            placeholder='Nomor HP - 08'
            label='Nomor HP'
            error={!!errors.nomor_hp}
            helperText={errors.nomor_hp?.message as string}
            {...register('nomor_hp', {
              required: 'Nomor HP wajib diisi',
              minLength: { value: 10, message: 'Nomor tidak valid' }
            })}
            className='w-full sm:w-1/4' // Full width on small screens and half on larger
          />
          <CustomTextField
            label='Nama Lengkap'
            type='text'
            placeholder='Nama Lengkap'
            error={!!errors.name}
            helperText={errors.name?.message as string}
            {...register('name', {
              required: 'Nama wajib diisi'
            })}
            className='w-full sm:w-1/4' // Full width on small screens and half on larger
          />
          {/* Using Controller for kategori */}
          <Controller
            name='kategori'
            control={control}
            defaultValue=''
            rules={{
              required: 'Kategori wajib dipilih'
            }}
            render={({ field }) => (
              <CustomTextField
                label='Kategori'
                {...field}
                select
                className='w-full sm:w-1/4'
                placeholder='Pilih Kategori'
                error={!!errors.kategori}
                helperText={errors.kategori?.message as string}
              >
                <MenuItem value=''>
                  <em>Pilih Kategori</em>
                </MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Button
            variant='contained'
            type='submit'
            disabled={isPending || watch('name') === '' || watch('kategori') === '' || watch('nomor_hp').length < 10}
            className='w-full sm:w-auto '
          >
            {isPending ? 'Meminta OTP...' : 'Kirim OTP'}
          </Button>
        </div>
      </form>

      {step === 'otp' && (
        <form onSubmit={handleSubmit(onLogin)} className='space-y-4 sm:space-y-6 mt-4'>
          <h2 className='text-xl font-semibold'>Verifikasi OTP</h2>
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
            <CustomTextField
              type='text'
              placeholder='Nomor HP - 08'
              value={getValues('nomor_hp')} // Menampilkan nomor HP di form OTP
              disabled
              error={!!errors.nomor_hp}
              helperText={errors.nomor_hp?.message as string}
              {...register('nomor_hp')} // Nomor HP tetap ada di form dan tidak bisa diedit
              className='w-full sm:w-1/2' // Full width on small screens and half on larger
            />
            <CustomTextField
              type='text'
              placeholder='Kode OTP'
              error={!!errors.kode_otp}
              helperText={errors.kode_otp?.message as string}
              {...register('kode_otp', {
                required: 'Kode OTP wajib diisi',
                minLength: { value: 6, message: 'Harus 6 digit' },
                maxLength: { value: 6, message: 'Harus 6 digit' }
              })}
              className='w-full sm:w-1/2' // Full width on small screens and half on larger
            />
            <Button variant='contained' type='submit' disabled={isPending} className='w-full sm:w-auto'>
              {isPending ? 'Login...' : 'Verifikasi & Login'}
            </Button>
          </div>
        </form>
      )}

      <div className='mt-4'>
        <NomorLoginList data={nomor} />
      </div>
    </div>
  )
}

export default DaftarNomorPage

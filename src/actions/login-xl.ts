'use server'

import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const LoginSchema = z.object({
  nomor_hp: z.string().min(10),
  kode_otp: z.string().length(6)
})

const API_HOST = 'https://api.tuyull.my.id'
const API_KEY = process.env.AKRAB_API_KEY!

export async function loginNomor(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = LoginSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'Input tidak valid' }
  }

  const { nomor_hp, kode_otp } = parsed.data

  try {
    const res = await fetch(`${API_HOST}/api/v1/verif-otp?nomor_hp=${nomor_hp}&kode_otp=${kode_otp}`, {
      headers: {
        Authorization: API_KEY
      }
    })

    const json = await res.json()

    if (json?.status !== 'success' || json?.data?.data?.access_token == null) {
      return { success: false, error: 'Login gagal' }
    }

    const { access_token, refresh_token } = json.data.data

    // Simpan ke database
    await prisma.nomorLogin.upsert({
      where: { nomorHp: nomor_hp },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token ?? null
      },
      create: {
        nomorHp: nomor_hp,
        accessToken: access_token,
        refreshToken: refresh_token ?? null
      }
    })

    return { success: true, token: access_token }
  } catch (error) {
    console.error('Login Error:', error)

    return { success: false, error: 'Terjadi kesalahan server' }
  }
}

const otpSchema = z.object({
  nomor_hp: z.string()
})

export async function getOtp(data: FormData) {
  const raw = Object.fromEntries(data.entries())
  const parsed = otpSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Nomor tidak valid',
      issues: parsed.error.flatten()
    }
  }

  const { nomor_hp } = parsed.data

  try {
    const res = await fetch(`${API_HOST}/minta-otp?nomor_hp=${encodeURIComponent(nomor_hp)}`, {
      method: 'GET',
      headers: { Authorization: API_KEY }
    })

    const json = await res.json()

    return { success: true, data: json }
  } catch (error) {
    console.log(error)

    return { success: false, error: 'Gagal request OTP', detail: error }
  }
}

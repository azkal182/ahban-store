// // app/actions/akrab.ts
// 'use server'

// import { z } from 'zod'

// const API_URL = 'https://api.tuyull.my.id/api/akrab'
// const API_KEY = process.env.AKRAB_API_KEY!

// async function akrabAction<T extends z.ZodTypeAny>(action: string, schema: T, formData: FormData) {
//   const raw = Object.fromEntries(formData.entries())
//   const parsed = schema.safeParse(raw)

//   if (!parsed.success) {
//     return {
//       success: false,
//       error: 'Input tidak valid',
//       issues: parsed.error.flatten()
//     }
//   }

//   try {
//     const body = JSON.stringify({ action, ...parsed.data })

//     const res = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         Authorization: API_KEY,
//         'Content-Type': 'application/json'
//       },
//       body
//     })

//     const json = await res.json()

//     return { success: true, data: json }
//   } catch (error) {
//     return { success: false, error: 'Request failed', detail: error }
//   }
// }

// const baseSchema = z.object({
//   id_telegram: z.string(),
//   password: z.string(),
//   nomor_hp: z.string()
// })

// const addSchema = baseSchema.extend({
//   nomor_slot: z.string(),
//   nomor_anggota: z.string(),
//   nama_anggota: z.string(),
//   nama_admin: z.string()
// })

// const editSchema = baseSchema.extend({
//   nomor_slot: z.string(),
//   input_gb: z.string()
// })

// const kickSchema = baseSchema.extend({
//   nomor_slot: z.string()
// })

// const infoSchema = baseSchema
// const slotSchema = baseSchema
// const autoKickSchema = baseSchema

// export async function addAkrab(data: FormData) {
//   return akrabAction('add', addSchema, data)
// }

// export async function editAkrab(data: FormData) {
//   return akrabAction('edit', editSchema, data)
// }

// export async function kickAkrab(data: FormData) {
//   return akrabAction('kick', kickSchema, data)
// }

// export async function infoAkrab(data: FormData) {
//   return akrabAction('info', infoSchema, data)
// }

// export async function slotAkrab(data: FormData) {
//   return akrabAction('slot', slotSchema, data)
// }

// export async function autoKickAkrab(data: FormData) {
//   return akrabAction('bekasankick', autoKickSchema, data)
// }

// app/actions/akrab.ts
'use server'

import { z } from 'zod'

import { nanoid } from 'nanoid'

import { prisma } from '@/lib/prisma'
import { containsAkrab } from './cek-akrab'

const API_URL = 'https://api.tuyull.my.id/api/akrab'
const API_KEY = process.env.AKRAB_API_KEY!
const PASSWORD = process.env.PASSWORD!
const ID_TELEGRAM = process.env.ID_TELEGRAM!
const BASE_URL = 'https://api.tuyull.my.id/api/v1'

async function akrabAction<T extends z.ZodTypeAny>(action: string, schema: T, formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: 'Input tidak valid', issues: parsed.error.flatten() }
  }

  if (action === 'add') {
    const hasAkrab = await checkAkrab(parsed.data.nomor_anggota) //boolean

    if (!hasAkrab.hasAkrab) {
      return { success: false, error: 'Nomor tidak terdaftar sebagai Akrab' }
    }
  }

  try {
    const body = JSON.stringify({ action, ...parsed.data, password: PASSWORD, id_telegram: ID_TELEGRAM })

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json'
      },
      body
    })

    const json = await res.json()

    // if (syncNomor && json?.data?.data_slot) {
    //   await syncSlotAkrab(syncNomor, json.data.data_slot)
    // }

    if (action === 'add' || action === 'edit' || action === 'kick' || action === 'bekasankick') {
      await infoSlotAkrab(createFormData({ nomor_hp: parsed.data.nomor_hp }))
    }

    return { success: true, data: json }
  } catch (error) {
    return { success: false, error: 'Request failed', detail: error }
  }
}

const baseSchema = z.object({
  nomor_hp: z.string()
})

const addSchema = baseSchema.extend({
  nomor_slot: z.string(),
  nomor_anggota: z.string(),
  nama_anggota: z.string(),
  nama_admin: z.string()
})

const addEditSchema = baseSchema.extend({
  nomor_anggota: z.string(),
  nama_anggota: z.string(),
  nama_admin: z.string(),
  input_gb: z.string(),
  nomor_hp: z.string()
})

const editSchema = baseSchema.extend({
  nomor_slot: z.string(),
  input_gb: z.string()
})

const kickSchema = baseSchema.extend({
  nomor_slot: z.string()
})

const infoSchema = baseSchema
const slotSchema = baseSchema
const autoKickSchema = baseSchema

const otpSchema = z.object({
  nomor_hp: z.string()
})

export async function getOtp(data: FormData) {
  const raw = Object.fromEntries(data.entries())
  const parsed = otpSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: 'Nomor tidak valid', issues: parsed.error.flatten() }
  }

  const { nomor_hp } = parsed.data
  const hasAkrab = await checkAkrab(nomor_hp) //boolean

  if (!hasAkrab.hasAkrab) {
    return { success: false, error: 'Nomor tidak terdaftar sebagai Akrab' }
  }

  try {
    const res = await fetch(`${BASE_URL}/minta-otp?nomor_hp=${encodeURIComponent(nomor_hp)}`, {
      method: 'GET',
      headers: { Authorization: API_KEY }
    })

    const json = await res.json()

    return { success: true, data: json }
  } catch (error) {
    return { success: false, error: 'Gagal request OTP', detail: error }
  }
}

const verifyOtpSchema = z.object({
  nomor_hp: z.string().min(10),
  kode_otp: z.string().length(6),
  name: z.string().min(1, 'Nama wajib diisi'),
  kategori: z.string().min(1, 'Kategori wajib diisi')
})

export async function loginNomor(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const parsed = verifyOtpSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: 'Input tidak valid', issues: parsed.error.flatten() }
  }

  const { nomor_hp, kode_otp, name, kategori } = parsed.data

  try {
    const res = await fetch(`${BASE_URL}/verif-otp?nomor_hp=${nomor_hp}&kode_otp=${kode_otp}`, {
      headers: { Authorization: API_KEY }
    })

    const json = await res.json()

    if (json?.status !== 'success' || !json?.data?.data?.access_token) {
      return { success: false, error: 'Login gagal' }
    }

    const { access_token, refresh_token } = json.data.data

    await prisma.nomorLogin.upsert({
      where: { nomorHp: nomor_hp },
      update: { accessToken: access_token, refreshToken: refresh_token ?? null },
      create: {
        name: name,
        nomorHp: nomor_hp,
        accessToken: access_token,
        refreshToken: refresh_token ?? null,
        kategoriId: kategori
      }
    })

    // Ambil dan sinkronisasi slot setelah login
    const slotRes = await infoSlotAkrab(createFormData({ nomor_hp }))

    if (!slotRes.success) {
      return { success: false, error: 'Login berhasil, tapi gagal sync slot' }
    }

    return { success: true, token: access_token }
  } catch (error) {
    console.log(error)

    return { success: false, error: 'Terjadi kesalahan server', detail: error }
  }
}

export async function addAkrab(data: FormData) {
  // Validasi data dengan safeParse
  const parsed = addEditSchema.safeParse(data)

  // Jika validasi gagal, kembalikan error
  if (!parsed.success) {
    console.log('Invalid data:', parsed.error.flatten())

    return { success: false, error: 'Data tidak valid', issues: parsed.error.flatten() }
  }

  const formData = new FormData()

  for (const key in parsed.data) {
    formData.append(key, parsed.data[key as keyof typeof parsed.data])
  }

  // Jika validasi berhasil, lanjutkan dengan aksi 'add'
  const res = await akrabAction('add', addSchema, formData)

  // Jika aksi 'add' gagal, lakukan aksi tambahan
  if (!res.success) {
    return res
  }

  // Jika 'add' berhasil, lanjutkan dengan aksi 'edit'
  const edit = await akrabAction('edit', addEditSchema, formData)

  if (res.success || edit.success) {
    await infoSlotAkrab(createFormData({ nomor_hp: parsed.data.nomor_hp }))
  }

  // Jika aksi 'edit' gagal, kembalikan hasilnya
  if (!edit.success) {
    return edit
  }

  // Jika kedua aksi berhasil, kembalikan hasil dari aksi 'edit'
  return edit
}

export async function editAkrab(data: FormData) {
  return akrabAction('edit', editSchema, data)
}

export async function kickAkrab(data: FormData) {
  return akrabAction('kick', kickSchema, data)
}

export async function infoAkrab(data: FormData) {
  return akrabAction('info', infoSchema, data)
}

export async function slotAkrab(data: FormData) {
  const raw = Object.fromEntries(data.entries())
  const parsed = slotSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: 'Input tidak valid', issues: parsed.error.flatten() }
  }

  try {
    const body = JSON.stringify({ action: 'slot', ...parsed.data, password: PASSWORD, id_telegram: ID_TELEGRAM })

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json'
      },
      body
    })

    const json = await res.json()

    console.log(JSON.stringify(json, null, 2))

    if (json?.data?.data_slot) {
      await syncSlotAkrab(parsed.data.nomor_hp, json.data.data_slot)
    }

    return { success: true, data: json }
  } catch (error) {
    return { success: false, error: 'Request failed', detail: error }
  }
}

export async function infoSlotAkrab(data: FormData) {
  const raw = Object.fromEntries(data.entries())
  const parsed = slotSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: 'Input tidak valid', issues: parsed.error.flatten() }
  }

  try {
    const body = JSON.stringify({ action: 'info', ...parsed.data, password: PASSWORD, id_telegram: ID_TELEGRAM })

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json'
      },
      body
    })

    const json = await res.json()

    console.log(JSON.stringify(json, null, 2))

    if (json?.data?.data_slot) {
      await syncSlotAkrab(parsed.data.nomor_hp, json.data.data_slot, json.data.expired)
    }

    return { success: true, data: json }
  } catch (error) {
    return { success: false, error: 'Request failed', detail: error }
  }
}

export async function autoKickAkrab(data: FormData) {
  return akrabAction('bekasankick', autoKickSchema, data)
}

function createFormData(obj: Record<string, string>) {
  const formData = new FormData()

  Object.entries(obj).forEach(([key, val]) => formData.append(key, val))

  return formData
}

async function syncSlotAkrab(nomorHp: string, dataSlot: any[], expired?: string) {
  const login = await prisma.nomorLogin.findUnique({ where: { nomorHp } })

  if (!login) return
  await prisma.nomorLogin.update({ where: { id: login.id }, data: { expired: expired } })

  await prisma.slotAkrab.deleteMany({ where: { nomorLoginId: login.id } })

  await prisma.slotAkrab.createMany({
    data: dataSlot.map(s => ({
      nomorLoginId: login.id,
      slotKe: s['slot-ke'],
      alias: s.alias,
      nomor: s.nomor,
      sisaAdd: s['sisa-add'],
      slotId: s['slot-id'],
      kuotaBersma: s['kuota-bersama'],
      pemakaianKuotaBersama: s['pemakaian-kuota-bersama'],
      totalKuotaBenefit: s['total-kuota-benefit'],
      sisaKuotaBenefit: s['sisa-kuota-benefit']

      //   familyMemberId: s['family-member-id']
    }))
  })
}

export async function autoAddAkrabByKategori(params: { kategori: string; nomorAnggota: string }) {
  const { kategori, nomorAnggota } = params

  const login = await prisma.nomorLogin.findFirst({
    where: {
      Kategori: {
        nama: kategori
      },
      SlotAkrab: {
        some: {
          alias: '',
          nomor: ''
        }
      }
    },
    include: { SlotAkrab: true }
  })

  if (!login) {
    return { success: false, error: 'Tidak ada slot kosong pada kategori tersebut' }
  }

  const slotKosong = login.SlotAkrab.find(s => s.alias === '' && s.nomor === '')

  if (!slotKosong) {
    return { success: false, error: 'Slot kosong tidak ditemukan' }
  }

  const formData = createFormData({
    id_telegram: ID_TELEGRAM,
    password: PASSWORD,
    nomor_hp: login.nomorHp,
    nomor_slot: String(slotKosong.slotKe),
    nomor_anggota: nomorAnggota,
    nama_anggota: `anggota-${nanoid(6)}`,
    nama_admin: `admin-${nanoid(6)}`
  })

  return await addAkrab(formData)
}

export async function listKategoriWithSlotCount() {
  const kategoriList = await prisma.kategori.findMany({
    include: {
      nomorLogins: {
        include: {
          SlotAkrab: true
        }
      }
    }
  })

  return kategoriList.map(kategori => {
    const totalSlotKosong = kategori.nomorLogins.reduce((count, login) => {
      const kosong = login.SlotAkrab.filter(s => s.alias === '' && s.nomor === '').length

      return count + kosong
    }, 0)

    return {
      id: kategori.id,
      nama: kategori.nama,
      slotKosong: totalSlotKosong
    }
  })
}

export async function listNomorLoginWithSlotKosong() {
  const logins = await prisma.nomorLogin.findMany({
    include: {
      Kategori: true,
      SlotAkrab: true
    }
  })

  return logins.map(login => {
    const slotKosong = login.SlotAkrab.filter(
      s => s.alias === '' && s.nomor === '' && s.slotId !== 0 && s.sisaAdd === 3
    ).length

    const bekasanKosong = login.SlotAkrab.filter(
      s => s.alias === '' && s.nomor === '' && s.slotId !== 0 && (s.sisaAdd === 1 || s.sisaAdd === 2)
    ).length

    return {
      id: login.id,
      nomorHp: login.nomorHp,
      name: login.name,
      kategori: login.Kategori?.nama || null,
      slotKosong,
      bekasanKosong
    }
  })
}

export async function getDetailNomorLogin(nomorLoginId: string) {
  const login = await prisma.nomorLogin.findUnique({
    where: { id: nomorLoginId },
    include: {
      Kategori: true,
      SlotAkrab: true
    }
  })

  if (!login) return null

  return {
    id: login.id,
    nomorHp: login.nomorHp,
    name: login.name,
    kategori: login.Kategori?.nama || null,
    expired: login.expired,
    slots: login.SlotAkrab.filter(s => s.slotId !== 0) // hanya ambil yang punya slotId
      .map(s => ({
        slotKe: s.slotKe,
        alias: s.alias,
        nomor: s.nomor,
        sisaAdd: s.sisaAdd,
        slotId: s.slotId,
        kuotaBersama: s.kuotaBersma,
        pemakaianKuotaBersama: s.pemakaianKuotaBersama,
        totalKuotaBenefit: s.totalKuotaBenefit,
        sisaKuotaBenefit: s.sisaKuotaBenefit

        // familyMemberId: s.familyMemberId
      }))
  }
}

export async function getCategories() {
  const categories = await prisma.kategori.findMany({
    select: {
      id: true,
      nama: true
    }
  })

  return categories.map(cat => ({
    value: cat.id,
    label: cat.nama
  }))
}

export const checkAkrab = async (nomor: string) => {
  try {
    const res = await fetch(`https://api.tuyull.my.id/api/tools`, {
      method: 'POST',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'cek_dompul', nomor_hp: nomor, id_telegram: ID_TELEGRAM, password: PASSWORD })
    })

    const json = await res.json()

    console.log('Cek Akrab Response:', JSON.stringify(json, null, 2))

    if (json?.status === 'success') {
      const contains = containsAkrab(json)

      return { success: true, data: json.data, hasAkrab: contains }
    } else {
      return { success: false, error: json?.message || 'Cek Akrab gagal', hasAkrab: false }
    }
  } catch (error) {
    console.error('Error checking Akrab:', error)

    return { success: false, error: 'Terjadi kesalahan saat cek Akrab', hasAkrab: false }
  }
}

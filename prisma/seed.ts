import { faker } from '@faker-js/faker'

import { hashSync } from 'bcryptjs'

import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const password = hashSync('admin')
  const kategoriNames = ['JUMBO', 'LITE', 'HEMAT', 'FAMILY']
  const kategoriMap: Record<string, string> = {}

  await prisma.user.create({
    data: {
      username: 'admin',
      password
    }
  })

  // 1. Seed kategori
  for (const nama of kategoriNames) {
    const kategori = await prisma.kategori.upsert({
      where: { nama },
      update: {},
      create: { nama }
    })

    kategoriMap[nama] = kategori.id
  }

  // 2. Seed 10 nomor login acak untuk tiap kategori
  for (const namaKategori of kategoriNames) {
    for (let i = 0; i < 10; i++) {
      const nomor = `628${faker.phone.number({ style: 'national' })}`

      const login = await prisma.nomorLogin.create({
        data: {
          nomorHp: nomor,
          accessToken: faker.string.uuid(),
          refreshToken: faker.datatype.boolean() ? faker.string.uuid() : null,
          name: faker.person.fullName(),
          kategoriId: kategoriMap[namaKategori]
        }
      })

      const totalSlot = faker.helpers.rangeToNumber({ min: 2, max: 6 })

      const slotData = Array.from({ length: totalSlot }).map((_, idx) => {
        const kosong = faker.datatype.boolean()

        return {
          nomorLoginId: login.id,
          slotKe: idx + 1,
          alias: kosong ? '' : faker.person.firstName(),
          nomor: kosong ? '' : `628${faker.phone.number({ style: 'national' })}`,
          sisaAdd: kosong ? 0 : faker.number.int({ min: 1, max: 3 }),
          slotId: faker.number.int({ min: 10000, max: 99999 }),
          familyMemberId: faker.string.alphanumeric(20)
        }
      })

      await prisma.slotAkrab.createMany({ data: slotData })
    }
  }

  console.log('✅ Seeder berhasil dijalankan')
}

main()
  .catch(e => {
    console.error('❌ Seeder gagal:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

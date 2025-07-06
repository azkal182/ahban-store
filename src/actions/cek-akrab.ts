export interface ResponseData {
  status: string
  code: number
  data: ResponseDataData
  stderr: string
}

export interface ResponseDataData {
  status: string
  data: PurpleData
}

export interface PurpleData {
  msisdn: string
  category: string
  owner: string
  dukcapil: string
  tenure: string
  status: string
  expDate: Date
  SPExpDate: Date
  data: FluffyData
}

export interface FluffyData {
  packageInfo: Array<PackageInfo[]>
  packageInfoSP: Array<PackageInfoSP[]>
  lastUpdate: Date
}

export interface PackageInfo {
  packages: Packages
  benefits: Benefit[]
}

export interface Benefit {
  type: string
  bname: string
  quota: string
  remaining: string
}

export interface Packages {
  name: string
  expDate: Date
}

export interface PackageInfoSP {
  benefits: Benefit[]
}

// Fungsi untuk mengecek apakah ada kata "Akrab" dalam data dan mengembalikan hasil boolean
export function containsAkrab(response: ResponseData): boolean {
  //   console.log('Cek Akrab Data:', JSON.stringify(data, null, 2))

  // Memastikan data packageInfo ada dan berupa array

  if (Array.isArray(response.data.data.data.packageInfo)) {
    for (const packageSet of response.data.data.data.packageInfo) {
      if (Array.isArray(packageSet)) {
        for (const packageItem of packageSet) {
          console.log('Checking packageItem in packageInfo:', packageItem)

          if (packageItem.packages?.name) {
            const packageName = packageItem.packages.name.toLowerCase().trim() // Normalize the name for comparison

            console.log('Package Name:', packageName)

            if (packageName.includes('akrab')) {
              return true
            }
          }
        }
      }
    }
  }

  // Memastikan data packageInfoSP ada dan berupa array
  if (Array.isArray(response.data.data.data.packageInfoSP)) {
    for (const packageSet of response.data.data.data.packageInfoSP) {
      if (Array.isArray(packageSet)) {
        for (const packageItem of packageSet) {
          console.log('Checking packageItem in packageInfoSP:', packageItem)

          for (const benefit of packageItem.benefits) {
            console.log('Benefit:', benefit)
            const benefitName = benefit.bname.toLowerCase().trim() // Normalize the benefit name for comparison

            if (benefitName.includes('akrab')) {
              return true
            }
          }
        }
      }
    }
  }

  return false
}

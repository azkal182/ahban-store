import type { SidompulResponse } from '@/types/sidompul'

export function hasAkrabPackage(data: SidompulResponse): boolean {
  if (!data?.success || !data.data?.quotas?.success) return false

  return data.data.quotas.value.some(pkg => pkg.name.toLowerCase().includes('akrab'))
}

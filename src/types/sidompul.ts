// types/sidompul.ts

export type QuotaDetail = {
  name: string
  data_type: 'DATA' | 'SMS' | 'VOICE'
  percent: number
  total: number | string
  total_text: string
  remaining: number | string
  remaining_text: string
}

export type QuotaItem = {
  name: string
  date_end: string
  date_end_unix: number
  detail_quota: QuotaDetail[]
}

export type SidompulResponse = {
  success: boolean
  client_ip: string
  data: {
    prefix: FieldStatus<string>
    dukcapil: FieldStatus<string>
    status_4g: FieldStatus<string>
    active_card: FieldStatus<string>
    active_period: FieldStatus<string>
    grace_period: FieldStatus<string>
    quotas: FieldStatus<QuotaItem[]>
  }
}

type FieldStatus<T> = {
  success: boolean
  message: string
  value: T
}

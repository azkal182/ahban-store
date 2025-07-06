'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const res = await axios.get('/api/saldo')

      return res.data.balance as number
    }
  })
}

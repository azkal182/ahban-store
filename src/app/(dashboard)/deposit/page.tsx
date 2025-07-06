'use client'

import { useState, useEffect } from 'react'

import axios from 'axios'
import { Button, Typography } from '@mui/material'

import { useQueryClient } from '@tanstack/react-query'

import CustomTextField from '@/@core/components/mui/TextField'
import { useBalance } from '@/hooks/useBalance'

export default function DepositPage() {
  const [amount, setAmount] = useState(10000)
  const [qrisUrl, setQrisUrl] = useState('')
  const [orderId, setOrderId] = useState('')
  const [status, setStatus] = useState('')
  const { data: balance } = useBalance()
  const queryClient = useQueryClient()

  const handleDeposit = async () => {
    const res = await axios.post('/api/deposit/create', { amount })

    setQrisUrl(res.data.qris_url)
    setOrderId(res.data.order_id)
  }

  useEffect(() => {
    if (!orderId) return

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/deposit/status/${orderId}`)

        if (res.data.status === 'success') {
          clearInterval(interval)
          setStatus('Berhasil')

          // ⬇ Refresh balance tanpa reload halaman
          queryClient.invalidateQueries({ queryKey: ['balance'] })
        }
      } catch (err) {
        console.error('Error checking deposit status', err)
      }
    }, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  return (
    <div>
      <h1>Deposit via QRIS</h1>

      {/* Menampilkan saldo */}
      <div style={{ marginBottom: 16 }}>
        <Typography variant='h6'>Saldo saat ini: Rp{balance?.toLocaleString('id-ID')}</Typography>
      </div>

      <CustomTextField type='number' value={amount} onChange={e => setAmount(Number(e.target.value))} />
      <Button onClick={handleDeposit}>Generate QR</Button>
      {qrisUrl && (
        <div>
          <p>Scan QR ini:</p>
          <img src={qrisUrl} alt='QRIS' width={300} />
          <Typography>{qrisUrl}</Typography>
        </div>
      )}
      {status && <p>Status: {status}</p>}
    </div>
  )
}

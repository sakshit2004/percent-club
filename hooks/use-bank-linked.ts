"use client"

import { useEffect, useState } from "react"

export function useBankLinked() {
  const [linked, setLinked] = useState(false)

  useEffect(() => {
    const read = () => setLinked(typeof window !== 'undefined' && localStorage.getItem('bank_linked') === '1')
    read()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'bank_linked') read()
    }
    window.addEventListener('storage', onStorage)
    const i = setInterval(read, 5000)
    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(i)
    }
  }, [])

  return linked
}



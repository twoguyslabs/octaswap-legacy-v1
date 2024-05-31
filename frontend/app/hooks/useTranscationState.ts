import { useState } from 'react'

export default function useTranscationState() {
  const [isTransaction, setIsTransaction] = useState(false)

  return { isTransaction, setIsTransaction }
}

import { useState, useEffect } from 'react'

export default function useDeadline(inputAmount: string | bigint, outputAmount: string | bigint) {
  const [minutes, setMinutes] = useState(5)
  const [deadline, setDeadline] = useState(() => Date.now() + minutes * 60 * 1000)

  useEffect(() => {
    setDeadline(Date.now() + minutes * 60 * 1000)
  }, [minutes, inputAmount, outputAmount])

  return { minutes, setMinutes, deadline }
}

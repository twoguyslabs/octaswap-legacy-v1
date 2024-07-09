import { useState } from 'react'

export default function usePairIndex() {
  const [pairIndex, setPairIndex] = useState(0)

  return { pairIndex, setPairIndex }
}

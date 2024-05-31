import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function useCreateQueryString() {
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams],
  )

  return createQueryString
}

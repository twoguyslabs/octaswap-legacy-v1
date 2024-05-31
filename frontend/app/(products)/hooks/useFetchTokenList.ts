import { Token } from '@/constants/currency'
import { TOKEN_LIST_URL } from '@/constants/tokenListUrl'
import { useEffect, useState } from 'react'

export default function useFetchTokenList(): Token[] | undefined {
  const [tokenList, setTokenList] = useState()

  useEffect(() => {
    let isCleanup = false

    fetch(TOKEN_LIST_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!isCleanup) {
          setTokenList(data.tokens)
        }
      })

    return () => {
      isCleanup = true
    }
  }, [])

  return tokenList
}

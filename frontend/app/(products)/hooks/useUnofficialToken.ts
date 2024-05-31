import { Currency, Token } from '@/constants/currency'
import { useEffect, useState } from 'react'
import { erc20Abi } from 'viem'
import { useAccount, useReadContracts } from 'wagmi'

export default function useUnofficialToken(tokenAddress: `0x${string}` | undefined) {
  const { chainId } = useAccount()
  const [token, setToken] = useState<Token>()

  const contractConfig = {
    abi: erc20Abi,
    address: tokenAddress,
  }

  const { data: tokenInfo } = useReadContracts({
    contracts: [
      {
        ...contractConfig,
        functionName: 'name',
      },
      {
        ...contractConfig,
        functionName: 'symbol',
      },
      {
        ...contractConfig,
        functionName: 'decimals',
      },
    ],
  })

  const [name, symbol, decimals] = tokenInfo ?? []

  useEffect(() => {
    if (tokenAddress) {
      if (chainId && name?.result && symbol?.result && decimals?.result) {
        const tokenObject: Currency = {
          chainId,
          decimals: decimals.result,
          address: tokenAddress,
          name: name.result,
          symbol: symbol.result,
          logoURI: '',
        }

        setToken(tokenObject)
      }
    }
  }, [chainId, name?.result, symbol?.result, decimals?.result, tokenAddress])

  return token
}

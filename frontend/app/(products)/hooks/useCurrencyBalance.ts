import { useAccount, useBalance, useReadContract } from 'wagmi'
import { erc20Abi } from 'viem'
import { useEffect, useState } from 'react'

export default function useCurrencyBalance(tokenAddress?: string) {
  const [balance, setBalance] = useState<bigint>()

  const account = useAccount()

  const { data: nativeBalance } = useBalance({
    address: account.address,
    query: {
      refetchInterval: 1000,
    },
  })
  const address = account.address as `0x${string}`

  const { data: tokenBalance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 1000,
    },
  })

  useEffect(() => {
    if (tokenAddress) {
      setBalance(tokenBalance)
    } else {
      setBalance(nativeBalance?.value)
    }
  }, [tokenAddress, tokenBalance, nativeBalance?.value])

  return balance
}

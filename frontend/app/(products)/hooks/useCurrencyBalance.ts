import { useAccount, useBalance, useReadContract, useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import { useEffect, useState } from 'react'

export default function useCurrencyBalance(tokenAddress?: string) {
  const [balance, setBalance] = useState<bigint>()

  const account = useAccount()

  const { data: nativeBalance } = useBalance({ address: account.address })
  const address = account.address as `0x${string}`

  const { data: tokenBalance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [address],
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

import { Currency } from '@/constants/currency'
import { splitCurrencyType } from '@/lib/utils'
import { erc20Abi, formatEther, parseEther } from 'viem'
import { useReadContract } from 'wagmi'
import useAddress from '../../hooks/useAddress'
import useWrapped from './useWrapped'
import useCurrencyBalance from './useCurrencyBalance'

export default function useAllowance(
  currency: Currency | undefined,
  spender: `0x${string}`,
  amountToCompare: string | bigint | undefined,
) {
  const myAddress = useAddress()
  const wrapped = useWrapped()

  const { token } = splitCurrencyType(currency)

  const address = token?.address as `0x${string}`
  const tokenAddress = address === wrapped ? undefined : address

  const tokenBalance = useCurrencyBalance(tokenAddress)

  const amount = amountToCompare
    ? typeof amountToCompare === 'string'
      ? parseEther(amountToCompare)
      : amountToCompare
    : BigInt(0)

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'allowance',
    args: [myAddress, spender],
    query: {
      refetchInterval: 1000,
    },
  })

  const isExceedBalance = tokenBalance ? tokenBalance < amount : false
  const isAllowance = allowance ? allowance >= amount : false

  return tokenAddress ? isAllowance || isExceedBalance : true
}

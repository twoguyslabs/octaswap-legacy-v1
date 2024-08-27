import { erc20Abi, parseEther } from 'viem'
import { useReadContract } from 'wagmi'
import useAddress from '../../hooks/useAddress'
import useWrapped from './useWrapped'
import useCurrencyBalance from './useCurrencyBalance'

export default function useAllowance(
  tokenAddress: `0x${string}` | undefined,
  spender: `0x${string}`,
  amountToCompare: string | bigint | undefined,
) {
  const myAddress = useAddress()
  const wrapped = useWrapped()

  const token = tokenAddress === wrapped ? undefined : tokenAddress

  const tokenBalance = useCurrencyBalance(token)

  const amount = amountToCompare
    ? typeof amountToCompare === 'string'
      ? parseEther(amountToCompare)
      : amountToCompare
    : BigInt(0)

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: 'allowance',
    args: [myAddress, spender],
    query: {
      refetchInterval: 1000,
    },
  })

  const isExceedBalance = tokenBalance ? tokenBalance < amount : false
  const isAllowance = allowance ? allowance >= amount : false

  return token ? isAllowance || isExceedBalance : true
}

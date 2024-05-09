import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import testTokenlist from '../../../../test.tokenlist.json'
import { useNative } from './useNative'
import { erc20Abi } from 'viem'

export function useTokenlist() {
  const account = useAccount()
  const native = useNative()

  const address = account.address as `0x${string}`

  const tokensAddress = testTokenlist.tokens.map(({ address }) => address)

  const readTokenBalance = tokensAddress.map((addr) => {
    const tokenAddress = addr as `0x${string}`

    return {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: 'balanceOf',
      args: [address],
    }
  })

  const { data: tokensBalance } = useReadContracts({
    contracts: readTokenBalance,
  })

  console.log(tokensBalance)

  return tokensAddress
}

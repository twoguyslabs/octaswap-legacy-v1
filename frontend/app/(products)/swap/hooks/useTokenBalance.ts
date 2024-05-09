import { useAccount, useReadContracts } from 'wagmi'
import testTokenlist from '../../../../test.tokenlist.json'
import { erc20Abi } from 'viem'

export default function useTokenBalance() {
  const account = useAccount()

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

  return tokensBalance
}

import { Currency } from '@/constants/currency'

import { useReadContract } from 'wagmi'
import { PAIR_ABI } from '@/contracts/pair'
import usePair from './usePair'

export default function usePairReserves({
  currencyA,
  currencyB,
  pairAddress,
}: {
  currencyA?: Currency | undefined
  currencyB?: Currency | undefined
  pairAddress?: `0x${string}`
}) {
  const { pairAddress: altPairAddress } = usePair(currencyA, currencyB)

  const mainPairAddress = pairAddress ? pairAddress : altPairAddress

  const { data: pairReserves } = useReadContract({
    abi: PAIR_ABI,
    address: mainPairAddress,
    functionName: 'getReserves',
    query: {
      refetchInterval: 1000,
    },
  })

  const [reserveIn, reserveOut] = pairReserves ?? []

  const reserve0 = reserveIn ?? BigInt(0)
  const reserve1 = reserveOut ?? BigInt(0)

  return { reserve0, reserve1 }
}

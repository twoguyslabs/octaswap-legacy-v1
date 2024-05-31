import { Currency } from '@/constants/currency'
import { FACTORY_ABI, FACTORY_ADDRESS } from '@/contracts/octaswapFactory'
import { useReadContract } from 'wagmi'
import useCurrencyAddresses from './useCurrencyAddresses'
import { zeroAddress } from 'viem'

export default function usePair(currencyA: Currency | undefined, currencyB: Currency | undefined) {
  const { addressA, addressB } = useCurrencyAddresses(currencyA, currencyB)

  const { data: pairAddress } = useReadContract({
    abi: FACTORY_ABI,
    address: FACTORY_ADDRESS,
    functionName: 'getPair',
    args: [addressA, addressB],
  })

  const isPairAddress = pairAddress !== zeroAddress ? true : false

  return { isPairAddress, pairAddress }
}

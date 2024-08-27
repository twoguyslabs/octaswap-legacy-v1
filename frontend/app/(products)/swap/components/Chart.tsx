import { Currency } from '@/constants/currency'
import usePair from '../../hooks/usePair'

export default function Chart({
  currencyA,
  currencyB,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
}) {
  const OCS_ADDRESS = '0x595ee9dd6ca0c778dce1903c83c59e79336d1e93'

  const { isPairAddress, pairAddress } = usePair(currencyA, currencyB)
  const currentPairAddress = isPairAddress ? pairAddress : OCS_ADDRESS
  return (
    <div className='hidden xl:block'>
      {currentPairAddress ? (
        <iframe
          height='450'
          width='650'
          id='geckoterminal-embed'
          title='GeckoTerminal Embed'
          src={`https://www.geckoterminal.com/octaspace/pools/${currentPairAddress}?embed=1&info=0&swaps=0`}
          frameBorder='0'
          allow='clipboard-write'
          allowFullScreen
        ></iframe>
      ) : (
        <p className='flex h-[450px] w-[650px] items-center justify-center'>Loading chart...</p>
      )}
    </div>
  )
}

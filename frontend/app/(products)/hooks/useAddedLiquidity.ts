import { useLocalStorage } from '@uidotdev/usehooks'

export default function useAddedLiquidity() {
  const [addedLiquidity, setAddedLiquidity] = useLocalStorage<LiquidityPool[]>('addedLiquidity', [])

  const handleAddLiquidity = (pairAddress: `0x${string}` | undefined) => {}

  return { addedLiquidity, setAddedLiquidity }
}

import { NATIVE_TO_WRAPPED } from '@/constants/wrapped'
import { useChainId } from 'wagmi'

export default function useWrapped() {
  const chainId = useChainId()

  const wrapped = NATIVE_TO_WRAPPED[chainId as keyof typeof NATIVE_TO_WRAPPED]

  return wrapped
}

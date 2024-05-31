import { useAccount } from 'wagmi'

export default function useAddress() {
  const { address: myAddress } = useAccount()

  const address = myAddress ?? '0x'

  return address
}

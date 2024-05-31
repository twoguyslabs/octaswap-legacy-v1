import { Currency } from '@/constants/currency'
import { useLocalStorage } from '@uidotdev/usehooks'

export default function useAddedToken() {
  const [addedToken, setAddedToken] = useLocalStorage<Currency[]>('addedToken', [])

  return { addedToken, setAddedToken }
}
